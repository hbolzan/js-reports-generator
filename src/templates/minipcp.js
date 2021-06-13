import { trace } from "../logic/misc.js";
import { tHead, tFoot, tBody, styleSheet } from "./helpers.js";

const emptyThClass = "empty-th";
const emptyRow = columns => columns.reduce((row, col) => ({ ...row, [col.name]: "" }), []);

const MiniPCPTemplate = (context, settings) => {
    return {
        render: data => ["section",
                         ["header",
                          ["h3", params.title]],
                         ["table", { class: ["uk-table", "uk-table-divider", "uk-table-small", "uk-table-hover"] },
                          tHead(data, emptyThClass),
                          tBody({ ...data, rows: [ ...data.rows, emptyRow(data.columns) ] }),
                          tFoot(data, emptyThClass),],
                         ["footer",
                          ["h4", params.footer]]],
        style: trace(styleSheet(settings)),
    };
};

export default MiniPCPTemplate;
