import { Column } from "../../src/models/report-definition.js";
import { sum, count, avg } from "../../src/logic/aggregators.js";

// aggregators receive group data and aggregate it
// they may also receive parent data
// to make some computation against all data

describe("sum", () => {
    let column = Column.parse({ name: "value" });
    it("sums values from column", () => {
        expect(sum(column, [{ value: 1 }, { value: 5 }, { value: 10 }])).toBe(16);
        expect(sum(column, [{ value: "1" }, { value: 5 }, { value: 10 }])).toBe(16);
    });
});

describe("count", () => {
    let column = Column.parse({ name: "item" });
    it("counts number of events", () => {
        expect(count(column, [{ item: 1 }, { item: 5 }, { item: 10 }])).toBe(3);
        expect(count(column, [{ item: 1 }, { item: 5 }])).toBe(2);
    });
});

describe("avg", () => {
    let column = Column.parse({ name: "value" });
    it("returns arithmetic mean for column", () => {
        expect(avg(column, [{ value: 10 }, { value: 4 }])).toBe(7);
        expect(avg(column, [{ value: 10 }, { value: 3 }, { value: 5 }])).toBe(6);
        expect(avg(column, [])).toBeNull();
    });
});

describe("weightedMean", () => {
    let column = Column.parse({ name: "value" }),
        weightColumn = Column.parse({ name: "weight" });
    it("returns mean for column weighted by weight column", () => {
        expect(weightedMean(weightColumn, column, [
            { value: 5, weight: 1},
            { value: 5, weight: 2},
            { value: 5, weight: 3},
        ])).toBe(10);
    });
});
