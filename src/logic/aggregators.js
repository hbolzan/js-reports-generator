const sum = (total, value) => total + Number(value);
const count = (column, rows) => rows.length;

const avg = (column, rows) => {
    const c = count(column, rows);
    return c > 0 ? sum(column, rows) / c : null;
};

const weightedMean = (weightColumn, column, rows) => {
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

export { sum, count, avg, weightedMean };
