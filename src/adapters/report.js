import { identity, constantly } from "../logic/misc.js";
import { formatFloat, formatDate } from "../logic/format.js";
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
    integer: Intl.NumberFormat("pt-BR").format,
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
        numberFormat: toDisplayFormatFn(displayFormat, dataType),
    });
}

function toAggregator(aggregator, columns) {
    return Aggregator.parse({
        column: columns.filter(c => c.name === aggregator.columnName)[0],
    });
}

function toGrouping(grouping, columns) {
    return Grouping.parse({
        title: row => grouping.headLines.join("\n"),
        showAggregates: grouping.aggregatorsVisible,
        columns: columns.filter(c => grouping.columns.includes(c.name)),
    });
}

function dataSettings({ fields, aggregators, aggregatorsVisible, grouping, headLines, totals }) {
    const columns = fields.map(fieldToColumn);

    return DataSettings.parse({
        columns,
        aggregators: aggregators.map(a => toAggregator(a, columns)),
        showAggregates: aggregatorsVisible,
        grouping: toGrouping(grouping, columns),
        orderBy: [],
    });
}

function definitionToSettings(definition) {
    const { id, title, companyInfo } = definition,
          { page, html, styles } = defaultPageStyle.mediaPrint;

    return {
        name: id,
        title,
        owner: toOwner(companyInfo),
        page: Page.parse({ margins: Margins.parse({}) }),
        media: {
            screen: pageStyle([], defaultPageStyle.mediaScreen.styles),
            print: pageStyle([page, html], styles),
        },
        data: dataSettings(definition),
    };
}

export default definitionToSettings;
