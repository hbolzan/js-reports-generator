import { trace } from "../logic/misc.js";
import { tHead, tFoot, tBody, styleSheet } from "./helpers.js";

const emptyThClass = "empty-th";
const emptyRow = columns => columns.reduce((row, col) => ({ ...row, [col.name]: "" }), []);

const MiniPCPTemplate = (context, settings) => {
    function render(data) {
        console.log(settings);
        console.log(data);
        return ["section",
                ["header",
                 ["h2", { class: ["uk-text-bold"] }, settings.title]],
                ["table", { class: ["uk-table", "uk-table-divider", "uk-table-small", "uk-table-hover"] },
                 tHead(settings.data, emptyThClass),
                 // tBody({ ...data, rows: [ ...data.rows, emptyRow(data.columns) ] }),
                 // tFoot(data, emptyThClass),
                ],
                ["footer",
                 ["h4", settings.footer]]];
    }
    return {
        render,
        style: styleSheet(settings),
    };
};

export default MiniPCPTemplate;
