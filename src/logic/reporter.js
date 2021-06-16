function parsedToData({ data }) {
    const headers = data[0];
    return data.slice(1).map(row => _.zipObject(headers, row));
}

function argumentsToQueryString(args) {
    return args.map(a => `${ a.name }=${ a.value }`).join("&");
}

export { parsedToData, argumentsToQueryString };
