import { pipe, identity } from "../../logic/misc.js";
function DataHandler({ columns, aggregators, grouping, orderBy }) {

    function groupBy(d) {
        if (_.isEmpty(grouping.c)) {
            return d;
        }
        return _.groupBy(d, grouping.columns.reduce((g, c) => g + String(data[c])));
    }

    function prepare(rawData) {
        return pipe(
            rawData,
            [
                _.partialRight(_.sortBy, ...orderBy),
                groupBy,
            ],
        );


        // 1. sort
        // 2. group
        // 3. aggregate
    }

}

export default DataHandler;
