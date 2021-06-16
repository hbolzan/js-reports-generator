function withGroupDelimiter(s) {
    return _.map(s)
        .reverse()
        .reduce((accum, c, i) => (i > 0 && i%3 == 0 ? accum.concat(".") : accum).concat(c) , [])
        .reverse()
        .join("");
}

const decimalPlaces = format => (format.split(".").slice(1, 2)[0] || "").length;

function formatFloat(n, format) {
    const intN = Math.trunc(n),
          digits = decimalPlaces(format);
    return withGroupDelimiter(intN.toFixed(0)) +
        "," +
        (Math.round(((n-intN)*(10**digits))).toFixed(0).padEnd(digits, "0"));
}

const formatDate = d => d.split("-").reverse().join("/");

export { formatFloat, formatDate };
