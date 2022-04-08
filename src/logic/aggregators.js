function sumReducer(column, total, row) {
    const n = Number(row[column.name]);
    return isNaN(n) ? total : total + n;
}
const sum = (column, rows) => rows.reduce((total, row) => sumReducer(column, total, row), 0);
const concat = glue => (column, rows) => rows.reduce(
    (result, row) =>  result + (result !== "" ? glue : "") + String(row[column.name]),
    ""
);
const count = (column, rows) => rows.length;

const avg = (column, rows) => {
    const c = count(column, rows);
    return c > 0 ? sum(column, rows) / c : null;
};


const weightedMean = weightColumn => (column, rows) => {
    const w = weightColumn.name,
          c = column.name,
          totals = rows.reduce(
              (totals, row) => (
                  {
                      v: totals.v + row[c]*row[w],
                      w: totals.w + row[w]
                  }
              ),
              { v: 0, w: 0 }
          );
    return totals.w !== 0 ? totals.v / totals.w : null;
};

export { sum, concat, count, avg, weightedMean };
