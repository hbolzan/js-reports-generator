if (window._ == undefined) {
    window._ = require("lodash");
}

import { pipe } from "./misc.js";

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

export { groupValues, withGroupValues, group, sortDocuments, sort };
