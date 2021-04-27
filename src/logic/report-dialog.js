
function baseAttrs(id, name) {
    return { id: uuidGen(), name: param.name.from, class: ["uk-input"]};
}

function textInput({ uuidGen }, param, origin) {
    return ["input", baseAttrs(uuidGen(), param.name)];
}

function intInput({ uuidGen, Mask }, param, origin) {
    return [
        "input", { ...baseAttrs(uuidGen(), param.name), private: { init: Mask()}}
    ];
}

const inputs = {
    ptText: textInput,
    ptInt: intInput,
}

function dlgInput(context, param, origin) {
    return textInput(context, param, origin);
}

export { dlgInput };
