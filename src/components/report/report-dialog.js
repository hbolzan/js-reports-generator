import { trace } from "../../logic/misc.js";
import reportParamsForm from "../../logic/report-dialog.js";

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

function ReportDialog(context, reportParams) {
    const { id } = reportParams,
          dialogNode = document.getElementById("dialog-body"),
          dialogParams = reportParams.dialogParams;

    if ( ! doms[id] ) {
        doms[id] = context.Dom(context, reportParamsForm(context, dialogParams));
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