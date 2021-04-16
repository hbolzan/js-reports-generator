const schema = require("schm");
import { boolParse, identity, constantly } from "../logic/misc.js";
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
    value: { type: Function, default: () => function(row, data) { return row[this.name]; } },
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
    initial: { type: Function, default: () => constantly(0) },
});

const Grouping = schema({
    columns: [Column],
    title: { type: Function, default: () => identity },
    showAggregates: { type: Boolean, default: true },
});

const DataSettings = schema({
    columns: [Column],
    aggregators: [Aggregator],
    grouping: Grouping,
    orderBy: [String],
});

const ReportSettings = schema({
    name: String,
    title: String,
    owner: {
        name: { type: String, default: "MiniPCP" },
        address: String,
        phone: String,
        email: String,
        logo: String,
    },
    page: Page,
    media: {
        screen: PageStyle,
        print: PageStyle,
    },

    data: DataSettings,
});

export default ReportSettings;
export { Margins, PageStyle, Column, Page, Aggregator, Grouping, DataSettings };
