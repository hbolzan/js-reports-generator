function boolParse(x) {
    if ( typeof(x) === "string" ) {
        let xUpper = x.trim().toUpperCase();
        return xUpper !== "N" && xUpper !== "NO" && xUpper !== "" && xUpper !== "FALSE";
    }
    return Boolean(x);
}

export { boolParse };
