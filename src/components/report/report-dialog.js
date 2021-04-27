let dialogs = {};


function inputWrapper(input, inputId, param) {
    return ["div", { class: ["uk-margin"] },
            ["label", { class: ["uk-form-label"], for: inputId }, param.caption,
             ["div", { class: ["uk-form-controls"] },
              input]]];
}

function textInput({ uuidGen }, param) {
    const id = uuidGen();
    return inputWrapper(["input", { id, name: param.name, type: "text", class: ["uk-input"] }], id, param);
}

function fieldFrom(context, param) {
}

function form(context, params) {
    const fields = params.map(p => field(context, p));
    return ["form", { class: ["uk-form-horizontal"] }, ...fields];
}

function Dialog(context, reportId) {
    return {
        
    };
}

function ReportDialog(context, reportId) {
    if ( ! dialogs[reportId] ) {
        dialogs[reportId] = Dialog(reportId);
    }
    return dialogs[reportId];
}

export default ReportDialog;
