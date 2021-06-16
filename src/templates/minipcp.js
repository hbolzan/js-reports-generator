import { trace } from "../logic/misc.js";
import { tHead, tFoot, tBody, styleSheet, lineBreaksToListItems } from "./helpers.js";

const emptyThClass = "empty-th";
const emptyRow = columns => columns.reduce((row, col) => ({ ...row, [col.name]: "" }), []);


 // In this template, each data element is a group

const MiniPCPTemplate = (context, settings) => {
    const columnsHeader = tHead(settings.data, emptyThClass),
          visibleColumnsCount = settings.data.columns.reduce((sum, c) => c.visible ? sum + 1 : sum, 0);

    function groupHeader(group) {
        return ["table", { class: ["uk-table"] },
                ["tr",
                 ["td", lineBreaksToListItems(group.title)]]];
    }

    function groupBody(group) {
        return ["section",
                groupHeader(group),
                ["table", { class: ["uk-table", "uk-table-divider", "uk-table-small", "uk-table-hover"] },
                 columnsHeader,
                 tBody({ ...settings.data, rows: [ ...group.rows, emptyRow(settings.data.columns) ] })]];
                // tFoot(data, emptyThClass),
    }

    function render(data) {
        console.log(settings);
        console.log(data);
        return ["section",
                ["header",
                 ["h2", { class: ["uk-heading-bullet"] }, settings.title]],
                ...data.map(groupBody),
                ["footer",
                 ["h4", settings.footer]]];
    }
    return {
        render,
        style: styleSheet(settings),
    };
};

export default MiniPCPTemplate;
