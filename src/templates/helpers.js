const emptyTh = (data, thClass) => ["th", ({ class: [thClass], colspan: String(data.columns.length) })];

const columnHeader = (tr, column) => tr.concat([["th", column.label || column.name]]);
const columnsHeaderRow = data => data.columns.reduce(columnHeader, ["tr"]);
const tHead = (data, emptyClass) => ["thead", ["tr", emptyTh(data, emptyClass)], columnsHeaderRow(data)];
const tFoot = (data, emptyClass) => ["tfoot", ["tr", emptyTh(data, emptyClass)]];

const bodyTd = (tr, value) => [...tr, ["td", value]];
const bodyTr = (columns, row) => columns.reduce((tr, column) => bodyTd(tr, row[column.name]), ["tr"]);
const tBody = data => data.rows.reduce((trs, row) => [...trs, bodyTr(data.columns, row)], ["tbody"]);

export { emptyTh, columnHeader, columnsHeaderRow, tHead, tFoot, bodyTd, bodyTr, tBody };
