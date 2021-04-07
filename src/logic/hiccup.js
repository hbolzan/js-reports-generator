if (window._ == undefined) {
    window._ = require("lodash");
}

const hiccupAttrs = hiccup => hiccup ?
      (_.isObject(hiccup[1]) && ! _.isArray(hiccup[1]) ? { attrs: hiccup[1] } : null) :
      null;
const hiccupInnerText = remaining => _.isString(remaining[0]) ? { innerText: remaining[0] } : null;
const parseChildren = (remaining, idGenFn) => _.map(remaining, child => hiccupToObj(child, idGenFn));
const hiccupChildren = children => _.isEmpty(children) ? null : { children };
const withId = (attrs, idGenFn) => (attrs || {}).id ? attrs : Object.assign( { id: idGenFn() }, attrs);
const filterAttrs = attrs => _.reduce(
    attrs,
    (result, v, k) => _.isFunction(v) || k == "private" ? result : Object.assign(result, { [k]: v }),
    {}
);
const events = attrs => _.reduce(attrs, (e, v, k) => _.isFunction(v) ? Object.assign(e, { [k]: v }) : e, {});
const withEvents = (hiccupObj, events) => _.isEmpty(events) ? hiccupObj : Object.assign({}, hiccupObj, { events: events });

function withPrivate(hiccup, name, attr) {
    const priv = { ...(hiccup[1]?.private), [name]: attr },
          attrs = { ...hiccup[1], private: priv };
    return hiccup.slice(0, 1).concat(attrs).concat(hiccup.slice(2));
}

function hiccupToObj(hiccup, idGenFn) {
    const allAttrs = hiccupAttrs(hiccup) || {},
          attrs = { attrs: withId(filterAttrs(allAttrs.attrs), idGenFn) },
          remaining = _.slice(hiccup, _.isEmpty(allAttrs) ? 1 : 2),
          innerText = hiccupInnerText(remaining),
          children = parseChildren(innerText ? _.slice(remaining, 1) : _.slice(remaining, 0), idGenFn);
    return hiccup ?
        withEvents(
            _.merge(
                { tag: hiccup[0] },
                attrs,
                { private: _.get(allAttrs, "attrs.private", {}) },
                innerText,
                hiccupChildren(children)
            ),
            events(allAttrs.attrs)
        ) :
        null;
}

const camelToKebab = s => s.replace(/([A-Z])/g, "-$1").toLowerCase();
const attrRenderers = {
    arr: attr => attr.join(" "),
    obj: attr => _.reduce(attr, (rendered, v, k) => `${rendered} ${camelToKebab(k)}: ${v};`, "").trim(),
};
const attrValueType = attr => _.isArray(attr) ? "arr" : ( _.isObject(attr) ? "obj" : null);
const renderAttrFn = attr => _.get(attrRenderers, attrValueType(attr), _.identity);
const renderAttrValue = attr => renderAttrFn(attr)(attr);

function renderAttrs(attrs) {
    return _.reduce(
        attrs,
        (rendered, v, attr) => `${ rendered } ${ camelToKebab(attr) }="${ renderAttrValue(v)}"`, ""
    );
}

function objToHtml(hiccupObj) {
    return hiccupObj ?
        `<${ hiccupObj.tag
        }${ renderAttrs(hiccupObj.attrs)
        }>${ hiccupObj.innerText ? hiccupObj.innerText : ""
        }${ _.map(hiccupObj.children, objToHtml).join("")
        }</${ hiccupObj.tag }>` :
        "ERRO";
}

function toHtml(hiccup, idGenFn) {
    return objToHtml(hiccupToObj(hiccup, idGenFn));
}

const nodeId = node => _.get(node, "attrs.id");
const indexNode = (node, index) => Object.assign({ [nodeId(node)]: node }, index);
const indexChildren = (children, index) => _.reduce(children, (idx, child) => indexNodes(child, idx), index);

function indexNodes(node, index = {}) {
    return _.isArray(node) ?
        indexChildren(node, index) :
        (node ? indexNodes(node.children, indexNode(node, index)) : index);
}

const mergeAttrs = (base, local) => _.defaultsDeep(base, local);

export { withPrivate, toHtml, renderAttrValue, camelToKebab, hiccupToObj, objToHtml, indexNodes, mergeAttrs };
