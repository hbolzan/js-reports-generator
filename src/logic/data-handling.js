if (window._ == undefined) {
    window._ = require("lodash");
}

import { pipe, boolParse } from "./misc.js";

function group(rows, columns) {
    const groupGetters = columns.map(column => row => row[column]),
          groupValue = row => groupGetters.reduce((values, fn) => values.concat(fn(row)), []);
    return _.groupBy(rows, groupValue);
}

const groupReducer = (groupData, values, column) => ({ ...values, [column]: groupData[column]});

const groupValues = (groupingColumns, groupData) => {
    return groupingColumns.reduce((_.partial(groupReducer, _.head(groupData))), {});
};

const withGroupValues = (groups, groupingColumns) => _.map(groups, v => ({
    groupValues: groupValues(groupingColumns, v),
    rows: v,
}));

const sortDocuments = (namespace, columns, documents) => _.sortBy(
    documents,
    columns.map(column => `${ namespace }.${ column }`)
);

function sort(groups, groupingColumns, orderBy) {
    return pipe(
        groups,
        [
            _.partial(sortDocuments, "groupValues", groupingColumns),
            groups => groups.map(group => ({ ...group, rows: _.sortBy(group.rows, orderBy)}))
        ]
    );
}

function aggregateRows(rows, aggregators) {
    return aggregators.reduce(
        (result, a) => ({ ...result, [a.column.name]: a.compute(a.column, rows) }),
        {}
    );
}

function coerce(value, dataType) {
    if (dataType === Boolean) {
        return boolParse(value);
    }
    return dataType(value);
}

function parsedColumn(column, row, data) {
    return coerce(column.value(row, data), column.dataType);
}

const parseRow = (columns, row) => columns.reduce(
    (newRow, column) => ({ ...newRow, [column.name]: parsedColumn(column, row) }),
    {}
);

const parseRows = (columns, rows) => rows.map(_.partial(parseRow, columns));
const withTitle = (groupSettings, group) => ({ ...group, title: groupSettings.title(group) });
const withAggregates = (aggregators, group) => ({
    ...group,
    aggregates: aggregateRows(group.rows, aggregators),
});
const withAttrs = (assigners, groups) => groups.map(
    group => assigners.reduce((g, assigner) => assigner(g), group)
);

function prepare(rawData, dataSettings) {
    const groupColumns = dataSettings.grouping.columns.map(c => c.name),
          sortColumns = dataSettings.orderBy.map(c => c.name);
    return pipe(
        rawData,
        [
            _.partial(parseRows, dataSettings.columns),
            _.partialRight(group, groupColumns),
            _.partialRight(withGroupValues, groupColumns),
            _.partialRight(sort, groupColumns, sortColumns),
            _.partial(withAttrs, [
                _.partial(withTitle, dataSettings.grouping),
                _.partial(withAggregates, dataSettings.aggregators),
            ]),
        ]
    );
}

export {
    groupValues,
    withGroupValues,
    group,
    sortDocuments,
    sort,
    aggregateRows,
    coerce,
    parsedColumn,
    parseRow,
    withAttrs,
    prepare,
};
