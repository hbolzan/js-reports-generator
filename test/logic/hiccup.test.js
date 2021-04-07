import {
    withPrivate,
    toHtml,
    renderAttrValue,
    camelToKebab,
    hiccupToObj,
    objToHtml,
    indexNodes,
    mergeAttrs,
}
from "../../src/logic/hiccup.js";

/** hiccup notation
 *
 * [tag, [attrs, ] [innerText, ] [child-1, ] [child-2, ] [... ]]
 *
 */

describe("camelToKebab", () => {
    test("convert camel case to kebab case", () => {
        expect(camelToKebab("someKey")).toBe("some-key");
        expect(camelToKebab("wannaBeKebab")).toBe("wanna-be-kebab");
    });
});

describe("renderAttrValue", () => {
    test("render string value as is", () =>{
        expect(renderAttrValue("value")).toBe("value");
    });

    test("render array elements as list separated by spaces", () =>{
        expect(renderAttrValue(["a", "b", "c"])).toBe("a b c");
    });

    test("render object as key:values separated by semicolons", () =>{
        expect(renderAttrValue({color: "blue", height: "10px"}))
            .toBe("color: blue; height: 10px;");
    });

    test("convert key names to kebab case", () => {
        expect(renderAttrValue({backgroundColor: "blue", minHeight: "10px"}))
            .toBe("background-color: blue; min-height: 10px;");
    });
});

describe("hiccupToObj", () => {
    const idGenFn = () => "xyz";

    test("convert hiccup to obj", () => {
        expect(hiccupToObj(["div"], idGenFn)).toEqual({tag: "div", attrs: { id: "xyz" }, private: {}});
        expect(hiccupToObj(["div", {class: "x"}], idGenFn))
            .toEqual({tag: "div", attrs: {id: "xyz", class: "x"}, private: {}});
    });

    test("convert children recursively", () => {
        expect(hiccupToObj(["div", {class: "x"}, ["span"]], idGenFn))
            .toEqual({
                tag: "div",
                attrs: {id: "xyz", class: "x"},
                private: {},
                children: [{tag: "span", attrs: { id: "xyz" }, private: {}}]
            });
    });

    test("if second element is not an object, attrs receives only generated id", () => {
        expect(hiccupToObj(["div", ["span"]], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "xyz" },
                private: {},
                children: [{ tag: "span", attrs: { id: "xyz" }, private: {} }]
            });
    });

    test("add innerText to object when second or third element is a string", () => {
        expect(hiccupToObj(["div", "some text here", ["span"]], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "xyz" },
                private: {},
                innerText: "some text here",
                children: [{tag: "span", attrs: { id: "xyz" }, private: {}}]
            });

        expect(hiccupToObj(["div", {class: "x"}, "some text here", ["span"]], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "xyz", class: "x" },
                private: {},
                innerText: "some text here",
                children: [{tag: "span", attrs: { id: "xyz" }, private: {}}]
            });
    });

    test("add multiple children", () => {
        expect(hiccupToObj(["div", ["span"], ["p", "Some text here"]], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "xyz" },
                private: {},
                children: [
                    {tag: "span", attrs: { id: "xyz" }, private: {}},
                    {tag: "p", attrs: { id: "xyz" }, private: {}, innerText: "Some text here"}
                ]
            });
    });

    test("private attribute is not included in attrs", () => {
        expect(hiccupToObj(["div", { private: { x: 1, y: 2 } }, ["span"]], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "xyz" },
                private: { x: 1, y: 2 },
                children: [{ tag: "span", attrs: { id: "xyz" }, private: {} }]
            });

        expect(hiccupToObj(["div", { class: ["a", "b"], private: { x: 1, y: 2 }}, ["span"]], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "xyz", class: ["a", "b"] },
                private: { x: 1, y: 2 },
                children: [{ tag: "span", attrs: { id: "xyz" }, private: {} }]
            });
    });

    test("don't generate id if it already exists in hiccup", () => {
        expect(hiccupToObj(["div", { id: "some-id" }], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "some-id" },
                private: {}
            });

        expect(hiccupToObj(["div", { id: "some-id", class: ["abc"] }, "Inner Text"], idGenFn))
            .toEqual({
                tag: "div",
                attrs: { id: "some-id", class: ["abc"] },
                private: {},
                innerText: "Inner Text"
            });
    });

    test("attributes wich values are functions are put in a separated attribute called events", () => {
        let onClick = x => x;
        expect(hiccupToObj(["button", { class: ["xy"], onclick: onClick }], idGenFn))
            .toEqual({
                tag: "button",
                attrs: { id: "xyz", class: ["xy"] },
                private: {},
                events: { onclick: onClick }
            });
    });
});

describe("objToHtml", () => {
    test("render html tag", () => {
        expect(objToHtml({tag: "div"})).toBe("<div></div>");
        expect(objToHtml({tag: "i"})).toBe("<i></i>");
    });

    test("render tag with attributes", () => {
        expect(objToHtml({tag: "i", attrs: {class: "a b c", "uk-icon": "trash"}}))
            .toBe('<i class="a b c" uk-icon="trash"></i>');

        expect(objToHtml({tag: "i", attrs: {class: ["a", "b", "c"], "uk-icon": "trash"}}))
            .toBe('<i class="a b c" uk-icon="trash"></i>');

        expect(objToHtml({tag: "i", attrs: {class: ["a", "b", "c"], ukIcon: "trash"}}))
            .toBe('<i class="a b c" uk-icon="trash"></i>');

        expect(objToHtml({tag: "div", attrs: {style: {color: "blue"}}}))
            .toBe('<div style="color: blue;"></div>');

        expect(objToHtml({tag: "div", attrs: {style: {color: "blue", height: "10px"}}}))
            .toBe('<div style="color: blue; height: 10px;"></div>');
    });

    test("render tag with innerText", () => {
        expect(objToHtml({tag: "div", innerText: "TESTE"})).toBe("<div>TESTE</div>");
    });

    test("render tag with children", () => {
        expect(objToHtml({tag: "div", children: [{tag: "p"}]}))
            .toBe("<div><p></p></div>");

        expect(objToHtml({tag: "div", private: {}, children: [{tag: "p"}, {tag: "span"}]}))
            .toBe("<div><p></p><span></span></div>");
    });

    test("render tag with everything", () => {
        expect(objToHtml({
            tag: "div",
            attrs: {style: {color: "blue", height: "10px"}},
            innerText: "This is inner text",
            children: [{tag: "p"}, {tag: "span"}]
        }))
            .toBe('<div style="color: blue; height: 10px;">This is inner text<p></p><span></span></div>');
    });
});

describe("toHtml", () => {
    const idGenFn = () => "abc";

    test("render html tag", () => {
        expect(toHtml(["div"], idGenFn)).toBe("<div id=\"abc\"></div>");
        expect(toHtml(["section"], idGenFn)).toBe("<section id=\"abc\"></section>");
    });

    test("render tag with attributes", () => {
        expect(toHtml(["i", {class: "a b c", "uk-icon": "trash"}], idGenFn))
            .toBe('<i id=\"abc\" class="a b c" uk-icon="trash"></i>');
    });

    test("render array attr value as values separated by spaces", () => {
        expect(toHtml(["i", {class: ["a", "b", "c"]}], idGenFn))
            .toBe('<i id=\"abc\" class="a b c"></i>');
    });

    test("render map attr value as key-value list separated by semicolons", () => {
        expect(toHtml(["div", {style: {color: "blue"}}], idGenFn))
            .toBe('<div id=\"abc\" style="color: blue;"></div>');

        expect(toHtml(["div", {style: {color: "blue", height: "10px"}}], idGenFn))
            .toBe('<div id=\"abc\" style="color: blue; height: 10px;"></div>');
    });

    test("convert attributes names from to kebab case", () => {
        expect(toHtml(["i", {ukIcon: "trash"}], idGenFn))
            .toBe('<i id=\"abc\" uk-icon="trash"></i>');
    });
});

describe("indexNodes", () => {
    test("create a map with hiccup id's as keys", () => {
        expect(indexNodes({ tag: "div", attrs: { id: "a" } }))
            .toEqual({ "a": { tag: "div", attrs: { id: "a" } } });
    });

    test("traverse hiccup children", () => {
        expect(indexNodes({ tag: "div", attrs: { id: "a" }, children: [{ tag: "i", attrs: { id: "b" }}] }))
            .toEqual({
                "a": { tag: "div", attrs: { id: "a" }, children: [{ tag: "i", attrs: { id: "b" }}] },
                "b": { tag: "i", attrs: { id: "b" } }
            });
    });
});

describe("mergeAttrs", () => {
    test("merge hiccup attrs object", () => {
        expect(mergeAttrs({ class: "x", private: { x: 1 }}, { style: "y", private: { y: 2 } }))
            .toEqual({ class: "x", style: "y", private: { x: 1, y: 2 } });
    });
});

describe("withPrivate", () => {
    test("adds private attr to hiccup array", () => {
        expect(withPrivate(["div"], "x", "y"))
            .toEqual(["div", { private: { x: "y" } }]);
    });

    test("adds attribute to existing private object", () => {
        expect(withPrivate(["div", { id: "abc", private: { a: "1" } }], "x", "y"))
            .toEqual(["div", { id: "abc", private: { a: "1", x: "y" } }]);

        expect(withPrivate(["div", { id: "abc", private: { a: "1" } }, ["div", { z: "z" }]], "x", "y"))
            .toEqual(["div", { id: "abc", private: { a: "1", x: "y" } }, ["div", { z: "z" }]]);
    });
});
