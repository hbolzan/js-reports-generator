function parsedToData({ data }) {
    const headers = data[0];
    return data.slice(1).map(row => _.zipObject(headers, row));
}

export { parsedToData };
