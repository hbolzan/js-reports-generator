
const rawData = {
    rows: [
        { a: "b", b: "d", c: "a", d: "c" },
        { a: "a", b: "b", c: "c", d: "d" },
        { a: "b", b: "d", c: "b", d: "b" },
        { a: "a", b: "b", c: "d", d: "e" },
        { a: "a", b: "c", c: "a", d: "b" },
        { a: "a", b: "b", c: "d", d: "f" },
        { a: "a", b: "c", c: "a", d: "c" },
        { a: "b", b: "d", c: "c", d: "b" },
        { a: "b", b: "d", c: "d", d: "d" },
        { a: "a", b: "b", c: "d", d: "d" },
        { a: "a", b: "b", c: "c", d: "d" },
    ]
};

const groups = [
    {
        groupValues: { a: 1, b: 1 },
        rows: [{ a: 1, b: 1, c: "a", d: "b", e: "c" }, { a: 1, b: 1, c: "b", d: "c", e: "d" }]
    },

    {
        groupValues: { a: 1, b: 2 },
        rows: [{ a: 1, b: 2, c: "c", d: "d", e: "e" }, { a: 1, b: 2, c: "a", d: "b", e: "c" }]
    },

    {
        groupValues: { a: 2, b: 1 },
        rows: [{ a: 2, b: 1, c: "d", d: "e", e: "f" }, { a: 2, b: 1, c: "g", d: "h", e: "i" }]
    },

    {
        groupValues: { a: 2, b: 2 },
        rows: [{ a: 2, b: 2, c: "j", d: "k", e: "l" }, { a: 2, b: 2, c: "a", d: "b", e: "c" }]
    },

    {
        groupValues: { a: 3, b: 1 },
        rows: [{ a: 3, b: 1, c: "d", d: "d", e: "e" }, { a: 3, b: 1, c: "f", d: "g", e: "h" }]
    },
];

export { rawData, groups };
