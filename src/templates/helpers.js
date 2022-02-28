import { marginsToCSS, pageToCSS, objectToCSS } from "../logic/report.js";

const emptyTh = (data, thClass) => ["th", ({ class: [thClass], colspan: String(data.columns.length) })];

const columnHeader = (tr, column) => column.visible ? tr.concat([["th", column.label || column.name]]) : tr;
const columnsHeaderRow = data => data.columns.reduce(columnHeader, ["tr"]);
const tHead = (data, emptyClass) => ["thead", ["tr", emptyTh(data, emptyClass)], columnsHeaderRow(data)];
const tFoot = (data, emptyClass) => ["tfoot", ["tr", emptyTh(data, emptyClass)]];

const bodyTd = (tr, value) => [...tr, ["td", String(value)]];
const bodyTr = (columns, row) => columns.reduce(
    (tr, column) => column.visible ? bodyTd(tr, row[column.name]) : tr,
    ["tr"]
);
const tBody = data => data.rows.reduce((trs, row) => [...trs, bodyTr(data.columns, row)], ["tbody"]);

function lineBreaksToListItems(s) {
    const items = s.split("\n");
    if (items.length < 2) {
        return s;
    }
    return ["ul", { class: "uk-list" }, ...items.map(i => ["li", i])];
}

function parseCSSElement(elKey, el) {
    if (elKey == "page") {
        return [pageToCSS(el)];
    }
    if (elKey == "css") {
        return el;
    }
    return [objectToCSS(elKey, el)];
}

function parseStyle(media) {
    return _.keys(media.styles)
        .reduce((s, k) => s.concat(parseCSSElement(k, media.styles[k])), [])
        .join("\n") + "\n" +
        media.css.join("\n");
}

function styleSheet(settings) {
    return parseStyle(settings.media.global) + "\n" +
        `@media screen {\n${ parseStyle(settings.media.screen) }\n}\n\n` +
        `@media print {\n${ parseStyle(settings.media.print) }\n}`;
}

export {
    emptyTh,
    columnHeader,
    columnsHeaderRow,
    tHead,
    tFoot,
    bodyTd,
    bodyTr,
    tBody,
    styleSheet,
    lineBreaksToListItems
};
