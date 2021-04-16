import { Column } from "./report-definition.js";
const schema = require("schm");

// Aggregate is the result of an Aggregator computation
const Aggregate = schema({
    column: Column,
    result: String,
});

const Group = schema({
    title: String,
    groupValues: Object,
    rows: [Object],
    aggregates: [Aggregate],
});

// Data must contain final data, ready to render
const Data = schema({
    groups: [Group],
    aggregates: [Aggregate],
});

const RawData = schema({
    rows: [Object]
});

export { Data, RawData };
