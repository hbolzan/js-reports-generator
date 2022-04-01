import { trace, isEmpty } from "../logic/misc.js";
import { tHead, tBody, bodyTr, bodyAggrTr, styleSheet, lineBreaksToListItems } from "./helpers.js";

// In this template, each data element is a group

const emptyRow = columns => columns.reduce((row, col) => ({ ...row, [col.name]: "" }), []),
      columnWidthPercentage = (totalWidth, column) => Math.round(column.width/totalWidth*100),
      columnsTotalWidth = columns => columns.reduce((t, c) => t = t + c.width, 0);

function columnHeader(totalWidth, tr, column) {
    const p = columnWidthPercentage(totalWidth, column);
    return column.visible ?
        tr.concat([["th", { style: { width: `${p}%` } }, column.label || column.name]]) :
        tr;
}

function columnsHeaderRow({ columns }) {
    return columns.reduce((tr, column) => columnHeader(columnsTotalWidth(columns), tr, column), ["tr"]);
}

function columnFooter(aggregates, totalWidth, tr, column) {
    const p = columnWidthPercentage(totalWidth, column),
          aggr = aggregates[column.name] || "";
    return column.visible ?
        tr.concat([["tr", { style: { width: `${p}%` } }, aggr]]) :
        tr;
}

function columnsFooter(columns, aggregates) {
    return columns.reduce(
        (tr, c) => columnFooter(aggregates, columnsTotalWidth(columns), tr, c),
        ["tr"]
    );
}

function footerData(columns, aggregates) {
    return columns.reduce(
        (row, column) => ({ ...row, [column.name]: aggregates[column.name] || "" }),
        {}
    );
}

const GroupedDataTemplate = (context, settings) => {
    const columns = settings.data.columns,
          columnsHeader = ["thead", columnsHeaderRow(settings.data)],
          visibleColumnsCount = settings.data.columns.reduce((sum, c) => c.visible ? sum + 1 : sum, 0);

    function groupHeader({ title }) {
        return ["table", { class: ["uk-table", "uk-table-small"] },
                ["tr", ["td", lineBreaksToListItems(title)]]];
    }

    function withGroupAggregates(group, body) {
        if ( settings.data.grouping.showAggregates && ( ! isEmpty(group.aggregates) ) ) {
            return body.concat([bodyAggrTr(columns, footerData(columns, group.aggregates))]);
        }
        return body;
    }

    function groupBody(group) {
        return ["section", { class: ["group-container"] },
                groupHeader(group),
                ["table", { class: ["group-table", "uk-table", "uk-table-divider", "uk-table-small", "uk-table-hover"] },
                 columnsHeader,
                 withGroupAggregates(
                     group,
                     tBody({ ...settings.data, rows: [ ...group.rows, emptyRow(columns)]})
                 )]];
    }


    function render(data) {
        return ["section",
                ["div", { class: ["report-header"] },
                 ["h2", settings.title]],

                ["table", { class: ["uk-table", "uk-table-small"] },
                 ["thead", ["tr", ["td", ["div", { class: ["header-space"] }, "&nbsp;"]]]],
                 ["tbody", ["tr", ["td", ["div", ...data.map(groupBody)]]]],
                 ["tfoot", ["tr", ["td", ["div", { class: ["footer-space"] }, "&nbsp;"]]]]],

                ["div", { class: ["report-footer"] },
                 ["h4", settings.footer || "Rodapé"]]];
    }

    return {
        render,
        style: styleSheet(settings),
    };
};

export default GroupedDataTemplate;
