const schema = require("schm");

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

const ReportDefinition = schema({
    page: Page,
    name: String,
    title: String,
    orderBy: [String],
    groupBy: [String],
    mediaScreen: PageStyle,
    mediaPrint: PageStyle,
});

export default ReportDefinition;
export { Margins, Page, PageStyle };
