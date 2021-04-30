import { hiccupToObj, objToHtml, indexNodes } from "../../logic/hiccup.js";

function Dom(context, hiccup, css = "") {
    const { document, uuidGen, i18n } = context,
          asObj = hiccupToObj(hiccup, uuidGen),
          hiccupHashMap = indexNodes(asObj),
          asHtml = objToHtml(asObj),
          styleSheetId = uuidGen();

    function newStyleSheet() {
        const styleSheet = document.createElement("style");
        styleSheet.id = styleSheetId;
        document.head.appendChild(styleSheet);
        return styleSheet;
    }
    (document.getElementById(styleSheetId) || newStyleSheet()).innerHTML = css;

    function asDomNode() {
        const el = document.createElement("template");
        el.innerHTML = asHtml;
        return el.content.firstChild;
    }

    function setEventListeners(hiccupObj) {
        _.each(
            hiccupObj.events,
            (fn, event) => document
                .getElementById(hiccupObj.attrs.id)
                .addEventListener(event.replace("on", ""), fn, false)
        );
    }

    function initNode(node) {
        let newNode = node;
        _.each(node.private, (value, name) => {
            if ( _.isFunction(value) ) {
                newNode = value(
                    { id: node.attrs.id, self: node },
                    context,
                ) || newNode;
            }
        });
        return newNode;
    }

    function setupNodes() {
        _.each(hiccupHashMap, (node, id) => {
            setEventListeners(node);
            hiccupHashMap[id] = initNode(node);
        });
    }

    function renderIntoDomNode(domNode) {
        domNode.innerHTML = asHtml;
        setupNodes();
    }

    function appendToDomNode(domNode) {
        const child = domNode.appendChild(asDomNode());
        setupNodes();
        return child;
    }

    function appendTo(selectorId) {
        appendToDomNode(document.getElementById(selectorId));
    }

    function parentElement(parent) {
        if ( typeof(parent) === "string" ) {
            return document.getElementById(parent);
        }
        return parent;
    }

    function render(parent) {
        renderIntoDomNode(parentElement(parent));
    }

    function findFirst(attrName, value) {
        return _.filter(hiccupHashMap, node => _.get(node, attrName) == value)[0];
    }

    return {
        hiccup,
        asObj,
        asHtml,
        appendTo,
        appendToDomNode,
        renderIntoDomNode,
        render,
        findFirst,
    };
}

export default Dom;
