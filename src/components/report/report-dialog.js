import { pipe } from "../../logic/misc.js";
import reportParamsForm from "../../logic/report-dialog.js";
import { collectArguments } from "../../logic/report-dialog.js";

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
const reportArguments = id => pipe(id, [inputsById, collectArguments]);

function ReportDialog(context, reportParams) {
    const { id } = reportParams,
          dialogNode = document.getElementById("dialog-body"),
          reporter = context.Reporter(context, null, reportParams);

    function buttonClick() {
        reporter.report(reportArguments(id));
    }

    if ( ! doms[id] ) {
        doms[id] = context.Dom(
            context,
            reportParamsForm(context, reportParams, buttonClick)
        );
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
