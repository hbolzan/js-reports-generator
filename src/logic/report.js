if (window._ == undefined) {
    window._ = require("lodash");
}
import { camelToKebab } from "./hiccup.js";

function marginsToCSS(margins) {
    return margins ?
        `margin-left: ${ margins.left }; margin-top: ${ margins.top }; margin-right: ${ margins.right }; margin-bottom: ${ margins.bottom }` :
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
