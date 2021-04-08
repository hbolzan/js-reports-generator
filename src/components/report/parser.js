import { pageToCSS, objectToCSS } from "../../logic/report.js";

function parseCSSElement(elKey, el) {
    if (elKey == "page") {
        return [pageToCSS(el)];
    }
    if (elKey == "styles") {
        return el;
    }
    return [objectToCSS(elKey, el)];
}

function parseStyle(style) {
    return _.keys(style)
        .reduce((s, k) => s.concat(parseCSSElement(k, style[k])), [])
        .join("\n");
}

function styleSheet(style) {
    return `@media screen { ${ parseStyle(style.mediaScreen) } }` + "\n" +
        `@media print { ${ parseStyle(style.mediaPrint) } }`;
}

function ReportParser(context, template, reportDefinition) {

    const css = styleSheet(template.style);

    function parse(data) {
        return template.render(data);
    }

    function render(data) {
        return context.Dom(context, parse(data), css);
    }

    return {
        css,
        render,
    };
}

export default ReportParser;
