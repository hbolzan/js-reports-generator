if (window._ == undefined) {
    window._ = require("lodash");
}
import { camelToKebab } from "./hiccup.js";

function marginsToCSS(margins) {
    const toMargin = key => `margin-${ key }: ${ margins[key] }${ margins.unit }`;
    return margins ?
        ["left", "top", "right", "bottom"].map(k => `${ toMargin(k) }`).join("; ") :
        "";
}

function pageToCSS(page) {
    return page ?
        `@page { size: ${ page.size } ${ page.orientation }; ${ marginsToCSS(page.margins) } }` :
        "";
}

function objectToCSS(key, obj) {
    const style = _.keys(obj)
        .map(k => `${ camelToKebab(k) }: ${ obj[k] }`)
        .join("; ");
    return `${ key } { ${ style }; }`;
}

export { marginsToCSS, pageToCSS, objectToCSS };
