function trace(x) {
    console.log(x);
    return x;
}

function boolParse(x) {
    if ( typeof(x) === "string" ) {
        let xUpper = x.trim().toUpperCase();
        return xUpper !== "F" && xUpper !== "N" && xUpper !== "NO" && xUpper !== "" && xUpper !== "FALSE";
    }
    return Boolean(x);
}

const identity = x => x;
const constantly = x => () => x;
const pipe = (value, functions) => functions.reduce((v, f) => f(v), value);
const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
const assocIf = (o, k, v) => ( _.isEmpty(v) ) ? o : { ...o, [k]: v };

export { trace, boolParse, identity, constantly, pipe, capitalizeFirstLetter, assocIf };
