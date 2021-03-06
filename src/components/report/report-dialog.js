import { pipe } from "../../logic/misc.js";
import reportParamsForm from "../../logic/report-dialog.js";
import { collectArguments } from "../../logic/report-dialog.js";

let dialogs = {},
    doms = {},
    rendered;

function removeRendered(dialogNode) {
    if ( rendered ) {
        dialogNode.removeChild(rendered);
    }
}

const inputsById = id => Array.prototype.slice.call(dialogs[id].querySelectorAll("input"));
const reportArguments = id => pipe(id, [inputsById, collectArguments]);

function ReportDialog(context, reportSettings) {
    const id = reportSettings.settings.name,
          dialogNode = context.document.getElementById(context.renderNodes.dialog),
          reporter = context.Reporter(context, reportSettings);

    function buttonClick() {
        reporter.report(reportArguments(id));
    }

    if ( ! doms[id] ) {
        doms[id] = context.Dom(
            context,
            reportParamsForm(context, reportSettings, buttonClick)
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
