import { pipe } from "../../logic/misc.js";
import reportParamsForm from "../../logic/report-dialog.js";
import { collectArguments, argumentsToQueryString } from "../../logic/report-dialog.js";

let dialogs = {},
    doms = {},
    rendered;

function dialogElement(context, dom, dialogParams) {
    const el = context.document.createElement("template");
    el.innerHtml = dom.asHtml;
    return el.content.firstElementChild;
}

function removeRendered(dialogNode) {
    if ( rendered ) {
        dialogNode.removeChild(rendered);
    }
}

const inputsById = id => Array.prototype.slice.call(dialogs[id].querySelectorAll("input"));
const queryString = id => pipe(id, [inputsById, collectArguments, argumentsToQueryString]);

function buttonClick(id) {
    console.log(queryString(id));
}

function ReportDialog(context, reportParams) {
    const { id } = reportParams,
          dialogNode = document.getElementById("dialog-body");

    if ( ! doms[id] ) {
        doms[id] = context.Dom(context, reportParamsForm(context, reportParams, () => buttonClick(id)));
    }

    function show() {
        removeRendered(dialogNode);
        if ( ! dialogs[id] ) {
            rendered = doms[id].appendToDomNode(dialogNode);
            dialogs[id] = rendered;
        } else {
            rendered = dialogs[id];
            dialogNode.appendChild(rendered);
        }
        return rendered;
    }

    return {
        show,
    };
}

export default ReportDialog;
