import { Column, Grouping, Aggregator } from "../../src/models/report-definition.js";
import {
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
} from "../../src/logic/data-handling.js";
import { sum, avg, concat } from "../../src/logic/aggregators.js";
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

describe("aggregateRows", () => {
    const columnA = Column.parse({ name: "a" }),
          columnB = Column.parse({ name: "b" }),
          columnC = Column.parse({ name: "c" }),
          aggrSumA = Aggregator.parse({ column: columnA, compute: sum }),
          aggrSumB = Aggregator.parse({ column: columnB, compute: sum }),
          aggrAvgA = Aggregator.parse({ column: columnA, compute: avg }),
          aggrConcatC = Aggregator.parse({ column: columnC, compute: concat(", ") });

    const rows = [
        { ga: 1, gb: 2, a: 3, b: 5, c: "a" },
        { ga: 1, gb: 2, a: 4, b: 5, c: "b" },
        { ga: 2, gb: 2, a: 3, b: 5, c: "c" },
        { ga: 2, gb: 2, a: 3, b: 10, c: "d" },
    ];
    it("aggregates columns for all rows following agregator rules", () => {
        expect(aggregateRows(rows, [aggrSumA])).toEqual({ a: 13 });
        expect(aggregateRows(rows, [aggrSumB])).toEqual({ b: 25 });
        expect(aggregateRows(rows, [aggrSumA, aggrSumB])).toEqual({ a: 13, b: 25 });
        expect(aggregateRows(rows, [aggrAvgA, aggrConcatC])).toEqual({ a: 3.25, c: "a, b, c, d" });
    });
});

describe.only("coerce", () => {
    it("coerces value to data type", () => {
        expect(coerce("a", { dataType: String })).toBe("a");
        expect(coerce(1, { dataType: String })).toBe("1");
        expect(coerce(1, { dataType: Number })).toBe(1);
        expect(coerce("1", { dataType: Number })).toBe(1);
        expect(coerce("a", { dataType: Number })).toBeNaN();
        expect(coerce("S", { dataType: Boolean })).toBe(true);
        expect(coerce("N", { dataType: Boolean })).toBe(false);
        expect(coerce("2022-02-15T00:00:00", { dataType: Date, viewType: "date" })).toBe("15/02/2022");
        expect(coerce("2022-02-15", { dataType: Date, viewType: "date" })).toBe("15/02/2022");
        expect(coerce("2022-02-15T15:30:20.123", { dataType: Date, viewType: "time" })).toBe("15:30:20");
        expect(coerce("2022-02-15T15:30:20.123", { dataType: Date, viewType: "datetime" })).toBe("15/02/2022 15:30:20");
    });
});

describe("parsedColumn", () => {
    it("parses column value for a rawData row", () => {
        const calculatedColumn = Column.parse({
            name: "x",
            dataType: Number,
            value: (row, data) => row.a * row.b * row.c,
        });
        expect(parsedColumn(Column.parse({ name: "a" }), { a: "abcd" })).toBe("abcd");
        expect(parsedColumn(Column.parse({ name: "b" }), { b: "xyz" })).toBe("xyz");
        expect(parsedColumn(Column.parse({ name: "a", dataType: Boolean }), { a: "N" })).toBe(false);
        expect(parsedColumn(calculatedColumn, { a: 2, b: 4, c: 8 })).toBe(64);
    });
});

describe("withAttrs", () => {
    const groups = [
        { groupValues: { a: 1 }, rows: [{ a: 1,  b: 1 }, { a: 1,  b: 2 },], },
        { groupValues: { a: 2 }, rows: [{ a: 2,  b: 1 }, { a: 2,  b: 2 },], },
        { groupValues: { a: 3 }, rows: [{ a: 3,  b: 1 }, { a: 3,  b: 2 },], },
    ];
    it("applies a list of attrs assigners to each group", () => {
        expect(withAttrs(
            [
                group => ({ ...group, a: group.groupValues.a }),
                group => ({ ...group, b: group.groupValues.a*2 }),
            ],
            groups
        )).toEqual(
            [
                { groupValues: { a: 1 }, rows: [{ a: 1,  b: 1 }, { a: 1,  b: 2 },], a: 1, b: 2 },
                { groupValues: { a: 2 }, rows: [{ a: 2,  b: 1 }, { a: 2,  b: 2 },], a: 2, b: 4 },
                { groupValues: { a: 3 }, rows: [{ a: 3,  b: 1 }, { a: 3,  b: 2 },], a: 3, b: 6 },
            ]
        );
    });
});

describe("parseRow", () => {
    const columnA = Column.parse({ name: "a" }),
          columnF = Column.parse({ name: "f", dataType: Number }),
          columnX = Column.parse({ name: "x", dataType: Number, value: row => 2*row.f });
    it("evaluates each column and return parsed row", () => {
        expect(parseRow([columnA], { a: 1 })).toEqual({ a: "1" });
        expect(parseRow([columnA, columnF], { a: "a", f: 2 })).toEqual({ a: "a", f: 2 });
        expect(parseRow([columnA, columnF, columnX], { a: "a", f: 2 })).toEqual({ a: "a", f: 2, x: 4 });
    });
});

describe("prepare", () => {

    const rawData = [
        { a: "b", b: "d", c: "a", d: "c", f: 5 },
        { a: "a", b: "b", c: "c", d: "d", f: 2 },
        { a: "b", b: "d", c: "b", d: "b", f: 8 },
        { a: "a", b: "b", c: "d", d: "e", f: 3 },
        { a: "a", b: "c", c: "a", d: "b", f: 9 },
        { a: "a", b: "b", c: "d", d: "f", f: 1 },
        { a: "a", b: "c", c: "a", d: "c", f: 4 },
        { a: "b", b: "d", c: "c", d: "b", f: 7 },
        { a: "b", b: "d", c: "d", d: "d", f: 0 },
        { a: "a", b: "b", c: "d", d: "d", f: 6 },
        { a: "a", b: "b", c: "c", d: "d", f: 1 },
    ];

    const groups = [
        {
            title: "Group a+b",
            groupValues: { a: "a", b: "b" },
            rows: [
                { a: "a", b: "b", c: "c", d: "d", f: 1, x: 2 },
                { a: "a", b: "b", c: "c", d: "d", f: 2, x: 4 },
                { a: "a", b: "b", c: "d", d: "d", f: 6, x: 12 },
                { a: "a", b: "b", c: "d", d: "e", f: 3, x: 6 },
                { a: "a", b: "b", c: "d", d: "f", f: 1, x: 2 },
            ],
            aggregates: { d: "d/d/d/e/f", f: 13, x: 5.2 },
        },

        {
            title: "Group a+c",
            groupValues: { a: "a", b: "c" },
            rows: [
                { a: "a", b: "c", c: "a", d: "b", f: 9, x: 18 },
                { a: "a", b: "c", c: "a", d: "c", f: 4, x: 8 },
            ],
            aggregates: { d: "b/c", f: 13, x: 13 },
        },

        {
            title: "Group b+d",
            groupValues: { a: "b", b: "d" },
            rows: [
                { a: "b", b: "d", c: "a", d: "c", f: 5, x: 10 },
                { a: "b", b: "d", c: "b", d: "b", f: 8, x: 16 },
                { a: "b", b: "d", c: "c", d: "b", f: 7, x: 14 },
                { a: "b", b: "d", c: "d", d: "d", f: 0, x: 0 },
            ],
            aggregates: { d: "c/b/b/d", f: 20, x: 10 },
        },

    ];

    const columnA = Column.parse({ name: "a" }),
          columnB = Column.parse({ name: "b" }),
          columnC = Column.parse({ name: "c" }),
          columnD = Column.parse({ name: "d" }),
          columnF = Column.parse({ name: "f", dataType: Number }),
          columnX = Column.parse({ name: "x", dataType: Number, value: row => 2*row.f }),
          aggrSumF = Aggregator.parse({ column: columnF, compute: sum }),
          aggrAvgX = Aggregator.parse({ column: columnX, compute: avg }),
          aggrConcatD = Aggregator.parse({ column: columnD, compute: concat("/") });

    const dataSettings = {
        columns: [columnA, columnB, columnC, columnD, columnF, columnX],
        aggregators: [aggrConcatD, aggrSumF, aggrAvgX],
        grouping: {
            title: group => `Group ${ group.groupValues.a }+${ group.groupValues.b }`,
            columns: [columnA, columnB],
        },
        orderBy: [columnC, columnD, columnF],
    };

    it("converts raw data into groups list", () => {
        expect(prepare(rawData, dataSettings)).toEqual(groups);
    });
});
