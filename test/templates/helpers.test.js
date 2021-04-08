import {
    emptyTh,
    columnHeader,
    columnsHeaderRow,
    tHead,
    bodyTd,
    bodyTr,
    tBody
} from "../../src/templates/helpers.js";

describe("emptyTh", () => {
    test("returns empty th with colspan as columns count", () => {
        expect(emptyTh({ columns: [{ name: "a" }, { name: "b" }]}, "empty-th"))
            .toEqual(["th", { class: ["empty-th"], colspan: "2"}]);

        expect(emptyTh({ columns: [{ name: "a" }, { name: "b" }, { name: "c" }]}, "empty"))
            .toEqual(["th", { class: ["empty"], colspan: "3"}]);
    });
});

describe("tHead", () => {
    test("returns table header, with empty spacer and columns labels", () => {
        const data = { columns: [{ name: "a", label: "A" }, { name: "b" }, { name: "c", label: "CC" }]};
        expect(tHead(data, "empty-th"))
            .toEqual(["thead",
                      ["tr",
                       ["th", { class: ["empty-th"], colspan: "3"}]],
                      ["tr",
                       ["th", "A"],
                       ["th", "b"],
                       ["th", "CC"]]]);
    });
});

describe("bodyTd", () => {
    test("retuns value inside sibling td", () => {
        expect(bodyTd(["tr"], "A")).toEqual(["tr", ["td", "A"]]);
        expect(bodyTd(["tr", ["td", "A"]], "B")).toEqual(["tr", ["td", "A"], ["td", "B"]]);
    });
});

describe("bodyTr", () => {
    test("returns tr correponding to row", () => {
        const columns = [{ name: "b" }, { name: "a" }],
              row = { a: "AA", b: "BB" };
        expect(bodyTr(columns, row))
            .toEqual(["tr", ["td", "BB"], ["td", "AA"]]);
    });
});

describe("tBody", () => {
    test("returns table tbody with rows", () => {
        const data = {
            columns: [{ name: "b" }, { name: "a" }],
            rows: [
                { a: "A1", b: "B1" },
                { a: "A2", b: "B2" },
                { a: "A3", b: "B3" },
            ]
        };

        expect(tBody(data))
            .toEqual(["tbody",
                      ["tr", ["td", "B1"], ["td", "A1"]],
                      ["tr", ["td", "B2"], ["td", "A2"]],
                      ["tr", ["td", "B3"], ["td", "A3"]]]);
    });
});
