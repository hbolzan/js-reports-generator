import { identity, constantly, assocIf } from "../logic/misc.js";
import { formatInteger, formatFloat, formatDate } from "../logic/format.js";
import {
    Margins,
    PageStyle,
    Page,
    Column,
    Aggregator,
    Grouping,
    DataSettings,
    ReportSettings,
} from "../models/report-definition.js";
import { defaultPageStyle } from "../components/report/consts.js";

function address(endereco, cep, uf, cidade, bairro) {
    return `${ endereco }\n${ uf }, ${ cidade } - ${ bairro }\nCEP ${ cep }`;
}

function toOwner({ nome, endereco, telefone, email, cep, uf, cidade, bairro, url, logo }) {
    return {
        name: nome,
        address: address(endereco, cep, uf, cidade, bairro),
        phone: telefone,
        email,
        logo,
    };
}

function pageStyle(styles, css) {
    return PageStyle.parse({ styles, css });
}

function viewTypeToDataType(dataType) {
    if ( ["integer", "float"].includes(dataType) ) {
        return Number;
    }
    if ( ["date", "time", "datetime"].includes(dataType) ) {
        return Date;
    }
    if ( ["bool"].includes(dataType) ) {
        return Boolean;
    }
    return String;
}

const defaultDisplayFormats = {
    char: identity,
    bool: identity,
    image: identity,
    integer: formatInteger,
    float: n => formatFloat(n, "#.##"),
    date: formatDate,
    datetime: formatDate,
};

function toDisplayFormatFn(displayFormat, viewType) {
    if ( viewType == "float" && displayFormat !== "" ) {
        return n => formatFloat(n, displayFormat);
    }
    return defaultDisplayFormats[viewType];
}

function fieldToColumn({ columnName, dataType, displayFormat, label, visible, width }) {
    return Column.parse({
        name: columnName,
        viewType: dataType,
        dataType: viewTypeToDataType(dataType),
        label,
        width,
        visible,
        displayFormat: toDisplayFormatFn(displayFormat, dataType),
    });
}

function toAggregator(aggregator, columns) {
    const column = columns.filter(c => c.name === aggregator.columnName)[0];
    return column ? Aggregator.parse({ column }) : null;
}

const isNotSeparatorLine = line => line.split("").filter(c => c !== "=").length > 0;

function groupTitle(grouping) {
    const header = grouping.headLines.filter(isNotSeparatorLine).join("\n"),
          columns = header.match(/\<(.*?)\>/g)?.map(s => s.replaceAll("<", "").replaceAll(">", ""));
    return function (group) {
        const firstRow = group.rows[0];
        return columns?.reduce((s, col) => s.replaceAll(`<${ col }>`, firstRow[col]), header) || "";
    };
}

function toGrouping(grouping, columns) {
    return Grouping.parse({
        title: groupTitle(grouping),
        showAggregates: grouping.aggregatorsVisible,
        columns: columns.filter(c => grouping.columns.includes(c.name)),
    });
}

function dataSettings({ fields, aggregators, aggregatorsVisible, grouping, headLines, totals }) {
    const columns = fields.map(fieldToColumn);

    return DataSettings.parse({
        columns,
        aggregators: aggregators.map(a => toAggregator(a, columns)).filter(a => a !== null),
        showAggregates: aggregatorsVisible,
        grouping: toGrouping(grouping, columns),
        orderBy: [],
    });
}

function definitionToSettings(definition) {
    const { id, title, companyInfo, templateName } = definition,
          { page, html, styles } = defaultPageStyle.mediaPrint;

    return {
        name: id,
        title,
        templateName,
        owner: toOwner(companyInfo),
        page: Page.parse({ margins: Margins.parse({}) }),
        media: assocIf(
            {
                screen: pageStyle({}, defaultPageStyle.mediaScreen.styles),
                print: pageStyle({page, html}, styles),
            },
            "global", pageStyle({}, defaultPageStyle.global.css)
        ),
        data: dataSettings(definition),
    };
}

export default definitionToSettings;
