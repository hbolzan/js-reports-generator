import { Column } from "./report-definition.js";
const schema = require("schm");

const Group = schema({
    title: String,
    groupValues: Object,
    rows: [Object],
    aggregates: Object,
});

// Data must contain final data, ready to render
const Data = schema({
    groups: [Group],
    aggregates: Object,
});

const RawData = schema({
    rows: [Object]
});

export { Data, RawData };
