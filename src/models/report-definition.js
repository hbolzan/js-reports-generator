const schema = require("schm");
import { boolParse } from "../logic/misc.js";
import { sum } from "../logic/aggregators.js";

const Margins = schema({
    unit: { type: String, enum: ["mm", "cm", "in"], default: "mm" },
    left: { type: Number, default: 15 },
    top: { type: Number, default: 10 },
    right: { type: Number, default: 15 },
    bottom: { type: Number, default: 5 },
});

const Page = schema({
    size: { type: String, enum: ["A4", "letter", "legal"], default: "A4" },
    orientation: { type: String, enum: ["portrait", "landscape"], default: "portrait" },
    margins: Margins,
});

const PageStyle = schema({
    styles: [Object],
    css: [String],
});

const Column = schema({
    name: String,
    label: String,
    formula: { type: Function, default: () => (row, column, data) => row[column.name] },
    result: { type: Function, default: () => x => x },
    width: Number,
    visible: { type: Boolean, default: true },
    dataType: { type: String, enum: [String, Number, Boolean], default: String },
    viewType: { type: String, enum: ["text", "bool", "image"], default: "text", },
    numberFormat: String,
    boolParse: { type: Function, default: () => boolParse },
});

const Aggregator = schema({
    column: Column,
    compute: { type: Function, default: () => sum },
});

const Group = schema({
    columns: [Column],
    title: Function,
    showTotals: Boolean,
});

const ReportSettings = schema({
    name: String,
    title: String,
    page: Page,
    media: {
        screen: PageStyle,
        print: PageStyle,
    },

    columns: [Column],
    aggregators: [Aggregator],
    group: Group,
    orderBy: [String],
});

export default ReportSettings;
export { Margins, Column, Page, PageStyle };
