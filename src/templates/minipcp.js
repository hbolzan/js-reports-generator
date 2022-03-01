import { trace } from "../logic/misc.js";
import { emptyTh, tHead, tFoot, tBody, styleSheet, lineBreaksToListItems } from "./helpers.js";

// In this template, each data element is a group

const emptyThClass = "empty-th",
      emptyRow = columns => columns.reduce((row, col) => ({ ...row, [col.name]: "" }), []);

function columnHeader(totalWidth, tr, column) {
    const p = Math.round(column.width/totalWidth*100);
    return column.visible ?
        tr.concat([["th", { style: { width: `${p}%` } }, column.label || column.name]]) :
        tr;
}

function columnsHeaderRow(data) {
    const columns = data.columns,
          totalWidth = columns.reduce((t, c) => t = t + c.width, 0);
    return columns.reduce((tr, column) => columnHeader(totalWidth, tr, column), ["tr"]);
}

const MiniPCPTemplate = (context, settings) => {
    const columnsHeader = ["thead", columnsHeaderRow(settings.data)],
          visibleColumnsCount = settings.data.columns.reduce((sum, c) => c.visible ? sum + 1 : sum, 0);

    function groupHeader(group) {
        return ["table", { class: ["uk-table", "uk-table-small"] },
                ["tr", ["td", lineBreaksToListItems(group.title)]]];
    }

    function groupBody(group) {
        return ["section", { class: ["group-container"] },
                groupHeader(group),
                ["table", { class: ["group-table", "uk-table", "uk-table-divider", "uk-table-small", "uk-table-hover"] },
                 columnsHeader,
                 tBody({ ...settings.data, rows: [ ...group.rows, emptyRow(settings.data.columns) ] })]];
                // tFoot(data, emptyThClass),
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

    function renderOld(data) {
        console.log(settings);
        console.log(data);
        return ["section",
                ["header",
                 ["h2", { class: ["uk-heading-bullet"] }, settings.title]],
                ...data.map(groupBody),
                ["footer",
                 ["h4", "Rodapé"]]];
    }
    return {
        render,
        style: styleSheet(settings),
    };
};

export default MiniPCPTemplate;
