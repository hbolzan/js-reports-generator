import { Column } from "./report-definition.js";
const schema = require("schm");

// Aggregate is the result of an Aggregator computation
const Aggregate = schema({
    column: Column,
    result: Number,
});

// Data must contain the final data, ready to render
const Data = schema({
    rows: [Object],
    aggregates: [],
});
