import { Column, Grouping, Aggregator } from "../../src/models/report-definition.js";
import { rawData, groups } from "./aux/data-handling.js";
import {
    groupValues,
    withGroupValues,
    group,
    sortDocuments,
    sort,
    initials,
    aggregatorsReducer,
    aggregateRows,
} from "../../src/logic/data-handling.js";
import { sum, avg } from "../../src/logic/aggregators.js";
import { constantly } from "../../src/logic/misc.js";


const groupSettings = Grouping.parse({
    columns: [Column.parse({ name: "a" }), Column.parse({ name: "b" })]
});

describe("data grouping", () => {
    const rows = [
        { ga: 1, gb: 1, a: 10, b: 4 },
        { ga: 1, gb: 1, a: 8, b: 5 },
        { ga: 1, gb: 2, a: 3, b: 5 },
        { ga: 1, gb: 2, a: 4, b: 5 },
        { ga: 2, gb: 1, a: 3, b: 10 },
        { ga: 2, gb: 1, a: 4, b: 11 },
        { ga: 2, gb: 2, a: 3, b: 10 },
        { ga: 2, gb: 2, a: 3, b: 5 },
    ];
    const expected = {
        [[1, 1]]: [{ ga: 1, gb: 1, a: 10, b: 4 }, { ga: 1, gb: 1, a: 8, b: 5 },],
        [[1, 2]]: [{ ga: 1, gb: 2, a: 3, b: 5 }, { ga: 1, gb: 2, a: 4, b: 5 },],
        [[2, 1]]: [{ ga: 2, gb: 1, a: 3, b: 10 }, { ga: 2, gb: 1, a: 4, b: 11 },],
        [[2, 2]]: [{ ga: 2, gb: 2, a: 3, b: 10 }, { ga: 2, gb: 2, a: 3, b: 5 },],
    };
    it("returns data grouped by grouping coluns", () => {
        expect(group(rows, ["ga", "gb"])).toEqual(expected);
    });
});

describe("groupValues", () => {
    it("converts group key from array to values object", () => {
        expect(groupValues(["ga", "gb"], [{ ga: 2, gb: 2, a: 3, b: 10 }, { ga: 2, gb: 2, a: 3, b: 5 },]))
            .toEqual({ ga: 2, gb: 2 });
        expect(groupValues(["ga", "gb"], [{ ga: 1, gb: 2, a: 3, b: 5 }, { ga: 1, gb: 2, a: 4, b: 5 },]))
            .toEqual({ ga: 1, gb: 2 });
    });
});

describe("withGroupValues", ()=> {
    const groupsOne = { [[2, 2]]: [{ ga: 2, gb: 2, a: 3, b: 5 }, { ga: 2, gb: 2, a: 3, b: 10 },], },
          expectedOne = [
              {
                  groupValues: { ga: 2, gb: 2 },
                  rows: [{ ga: 2, gb: 2, a: 3, b: 5 }, { ga: 2, gb: 2, a: 3, b: 10 },]
              },
          ];
    it("converts groups object into groups list with groupValues at each element", () => {
        expect(withGroupValues(groupsOne, ["ga", "gb"])).toEqual(expectedOne);
    });
});

describe("sortDocuments", () => {
    const documents = [
        { data: { a: "b", b: "d", c: "a", d: "c" }},
        { data: { a: "a", b: "b", c: "c", d: "d" }},
        { data: { a: "b", b: "d", c: "b", d: "b" }},
        { data: { a: "a", b: "b", c: "d", d: "e" }},
        { data: { a: "a", b: "c", c: "a", d: "b" }},
        { data: { a: "a", b: "b", c: "d", d: "f" }},
        { data: { a: "a", b: "c", c: "a", d: "c" }},
        { data: { a: "b", b: "d", c: "c", d: "b" }},
        { data: { a: "b", b: "d", c: "d", d: "d" }},
        { data: { a: "a", b: "b", c: "d", d: "d" }},
        { data: { a: "a", b: "b", c: "c", d: "d" }},
    ];

    it("sorts an array of documents by document columns", () => {
        expect(sortDocuments("data", ["a", "b"], documents))
            .toEqual([
                { data: { a: "a", b: "b", c: "c", d: "d" }},
                { data: { a: "a", b: "b", c: "d", d: "e" }},
                { data: { a: "a", b: "b", c: "d", d: "f" }},
                { data: { a: "a", b: "b", c: "d", d: "d" }},
                { data: { a: "a", b: "b", c: "c", d: "d" }},
                { data: { a: "a", b: "c", c: "a", d: "b" }},
                { data: { a: "a", b: "c", c: "a", d: "c" }},
                { data: { a: "b", b: "d", c: "a", d: "c" }},
                { data: { a: "b", b: "d", c: "b", d: "b" }},
                { data: { a: "b", b: "d", c: "c", d: "b" }},
                { data: { a: "b", b: "d", c: "d", d: "d" }},
            ]);
    });
});

describe("data sorting", () => {
    const groups = [
        {
            groupValues: { ga: 2, gb: 2 },
            rows: [{ ga: 2, gb: 2, a: 3, b: 10 }, { ga: 2, gb: 2, a: 3, b: 5 },]
        },
        {
            groupValues: { ga: 1, gb: 1 },
            rows: [{ ga: 1, gb: 1, a: 10, b: 4 }, { ga: 1, gb: 1, a: 8, b: 5 },]
        },
        {
            groupValues: { ga: 2, gb: 1 },
            rows: [{ ga: 2, gb: 1, a: 4, b: 11 }, { ga: 2, gb: 1, a: 3, b: 10 },]
        },
        {
            groupValues: { ga: 1, gb: 2 },
            rows: [{ ga: 1, gb: 2, a: 3, b: 5 }, { ga: 1, gb: 2, a: 4, b: 5 },]
        },
    ];
    const expected = [
        {
            groupValues: { ga: 1, gb: 1 },
            rows: [{ ga: 1, gb: 1, a: 8, b: 5 }, { ga: 1, gb: 1, a: 10, b: 4 },]
        },
        {
            groupValues: { ga: 1, gb: 2 },
            rows: [{ ga: 1, gb: 2, a: 3, b: 5 }, { ga: 1, gb: 2, a: 4, b: 5 },]
        },
        {
            groupValues: { ga: 2, gb: 1 },
            rows: [{ ga: 2, gb: 1, a: 3, b: 10 }, { ga: 2, gb: 1, a: 4, b: 11 },]
        },
        {
            groupValues: { ga: 2, gb: 2 },
            rows: [{ ga: 2, gb: 2, a: 3, b: 5 }, { ga: 2, gb: 2, a: 3, b: 10 },]
        },
    ];
    it("returns groups sorted by grouping columns and data sorted by sort columns", () => {
        expect(sort(groups, ["ga", "gb"], ["a", "b"])).toEqual(expected);
    });
});

const columnA = Column.parse({ name: "a" }),
      columnB = Column.parse({ name: "b" }),
      columnC = Column.parse({ name: "c" }),
      aggrSumA = Aggregator.parse({ column: columnA, compute: sum }),
      aggrSumB = Aggregator.parse({ column: columnB, compute: sum }),
      aggrAvgA = Aggregator.parse({ column: columnA, compute: avg }),
      aggrConcatC = Aggregator.parse(
          {
              column: columnC,
              compute: (x, y) => x + (x !== "" ? ", " : "") + String(y),
              initial: constantly(""),
          }
      );

describe("initials", () => {
    it("returns an object with initial values for aggregators", () => {
        expect(initials([])).toEqual({});
        expect(initials([aggrSumA])).toEqual({ a: 0 });
        expect(initials([aggrSumA, aggrSumB])).toEqual({ a: 0, b: 0 });
        expect(initials([aggrSumA, aggrSumB, aggrConcatC])).toEqual({ a: 0, b: 0, c: "" });
    });
});

describe("aggregatorsReducer", () => {
    it("computes all aggregators for the current row", () => {
        expect(aggregatorsReducer({ a: 3, b: 5 }, { a: 5, b: 0 }, aggrSumA)).toEqual({ a: 8, b: 0 });
        expect(aggregatorsReducer({ a: 3, b: 5 }, { a: 8, b: 2 }, aggrSumB)).toEqual({ a: 8, b: 7 });
        expect(aggregatorsReducer({ a: 1, b: 2, c: "a" }, { c: "" }, aggrConcatC)).toEqual({ c: "a" });
        expect(aggregatorsReducer({ a: 1, b: 2, c: "b" }, { c: "a" }, aggrConcatC)).toEqual({ c: "a, b" });
    });
});

describe("aggregateRows", () => {
    const rows = [
        { ga: 1, gb: 2, a: 3, b: 5 },
        { ga: 1, gb: 2, a: 4, b: 5 },
        { ga: 2, gb: 2, a: 3, b: 5 },
        { ga: 2, gb: 2, a: 3, b: 10 },
    ];
    it("aggregates columns for all rows following agregator rules", () => {
        expect(aggregateRows(rows, [aggrSumA])).toEqual({ a: 13 });
        expect(aggregateRows(rows, [aggrSumB])).toEqual({ b: 25 });
        expect(aggregateRows(rows, [aggrSumA, aggrSumB])).toEqual({ a: 13, b: 25 });
    });
});

// describe("prepare", () => {

//     const rawData = {
//         rows: [
//             { a: "b", b: "d", c: "a", d: "c" },
//             { a: "a", b: "b", c: "c", d: "d" },
//             { a: "b", b: "d", c: "b", d: "b" },
//             { a: "a", b: "b", c: "d", d: "e" },
//             { a: "a", b: "c", c: "a", d: "b" },
//             { a: "a", b: "b", c: "d", d: "f" },
//             { a: "a", b: "c", c: "a", d: "c" },
//             { a: "b", b: "d", c: "c", d: "b" },
//             { a: "b", b: "d", c: "d", d: "d" },
//             { a: "a", b: "b", c: "d", d: "d" },
//             { a: "a", b: "b", c: "c", d: "d" },
//         ]
//     };

//     const groups = [
//         {
//             groupValues: { a: 1, b: 1 },
//             rows: [{ a: 1, b: 1, c: "a", d: "b", e: "c" }, { a: 1, b: 1, c: "b", d: "c", e: "d" }]
//         },

//         {
//             groupValues: { a: 1, b: 2 },
//             rows: [{ a: 1, b: 2, c: "c", d: "d", e: "e" }, { a: 1, b: 2, c: "a", d: "b", e: "c" }]
//         },

//         {
//             groupValues: { a: 2, b: 1 },
//             rows: [{ a: 2, b: 1, c: "d", d: "e", e: "f" }, { a: 2, b: 1, c: "g", d: "h", e: "i" }]
//         },

//         {
//             groupValues: { a: 2, b: 2 },
//             rows: [{ a: 2, b: 2, c: "j", d: "k", e: "l" }, { a: 2, b: 2, c: "a", d: "b", e: "c" }]
//         },

//         {
//             groupValues: { a: 3, b: 1 },
//             rows: [{ a: 3, b: 1, c: "d", d: "d", e: "e" }, { a: 3, b: 1, c: "f", d: "g", e: "h" }]
//         },
//     ];

//     const dataSettings = {
//         grouping: {
//             columns: ["a", "b"],
//         },
//         orderBy: ["c"],
//     };

//     it("converts raw data into groups list", () => {
//         expect(prepare(rawData, dataSettings)).toEqual(groups);
//     });
// });
