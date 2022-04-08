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

describe("columnHeader", () => {
    test("if column is visible, adds th element with column label or name to parent element", () => {
        expect(columnHeader(["tr"], { name: "a", visible: true })).toEqual(["tr", ["th", "a"]]);
        expect(columnHeader(["tr"], { name: "a", label: "A", visible: true })).toEqual(["tr", ["th", "A"]]);
    });

    test("doesn't add not visible columns", () => {
        expect(columnHeader(["tr"], { name: "a", visible: false })).toEqual(["tr"]);
    });
});

describe("columnsHeaderRow", () => {
    test("returns header row with visible columns", () => {
        const columns = [
            { name: "a", label: "A" },
            { name: "b", visible: true },
            { name: "c", label: "CC", visible: true }
        ];
        expect(columnsHeaderRow({ columns })).toEqual(["tr", ["th", "b"], ["th", "CC"]]);
    });
});

describe("tHead", () => {
    test("returns table header, with empty spacer and columns labels", () => {
        const data = {
            columns: [
                { name: "a", label: "A", visible: true },
                { name: "b", visible: true  },
                { name: "c", label: "CC", visible: true  }]
        };
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
        expect(bodyTd(["tr"], "A"))
            .toEqual(["tr", ["td", { style: { textAlign: "center" } }, "A"]]);
        expect(bodyTd(["tr", ["td", { style: { textAlign: "center" } }, "A"]], "B"))
            .toEqual(["tr", ["td", { style: { textAlign: "center" } }, "A"],
                      ["td", { style: { textAlign: "center" } }, "B"]]);
    });

    test("returns alignment style as defined by argument", () => {
        expect(bodyTd(["tr"], "A", "center"))
            .toEqual(["tr", ["td", { style: { textAlign: "center" } }, "A"]]);
        expect(bodyTd(["tr"], "A", "left"))
            .toEqual(["tr", ["td", { style: { textAlign: "left" } }, "A"]]);
        expect(bodyTd(["tr"], "A", "right"))
            .toEqual(["tr", ["td", { style: { textAlign: "right" } }, "A"]]);
    });

});

describe("bodyTr", () => {
    test("returns tr correponding to row", () => {
        const columns = [
            { name: "b", visible: true, alignment: () => "center", displayFormat: x => x },
            { name: "a", visible: true, alignment: () => "left", displayFormat: x => x   }
        ],
              row = { a: "AA", b: "BB" };
        expect(bodyTr(columns, row))
            .toEqual(["tr",
                      ["td", { style: { textAlign: "center" } }, "BB"],
                      ["td", { style: { textAlign: "left" } }, "AA"]]);
    });
});

describe("tBody", () => {
    test("returns table tbody with rows", () => {
        const data = {
            columns: [
                { name: "b", visible: true, alignment: () => "center", displayFormat: x => x  },
                { name: "a", visible: true, alignment: () => "center", displayFormat: x => x  },
            ],
            rows: [
                { a: "A1", b: "B1" },
                { a: "A2", b: "B2" },
                { a: "A3", b: "B3" },
            ]
        };

        expect(tBody(data))
            .toEqual(["tbody",
                      ["tr",
                       ["td", { style: { textAlign: "center" } }, "B1"],
                       ["td", { style: { textAlign: "center" } }, "A1"]],
                      ["tr",
                       ["td", { style: { textAlign: "center" } }, "B2"],
                       ["td", { style: { textAlign: "center" } }, "A2"]],
                      ["tr",
                       ["td", { style: { textAlign: "center" } }, "B3"],
                       ["td", { style: { textAlign: "center" } }, "A3"]]]);
    });
});
