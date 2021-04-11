const sum = (column, rows) => rows.reduce((total, row) => total + Number(row[column.name]), 0);
const count = (column, rows) => rows.length;
const avg = (column, rows) => {
    const c = count(column, rows);
    return c > 0 ? sum(column, rows) / c : null;
};

export { sum, count, avg };
