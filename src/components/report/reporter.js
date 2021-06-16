import { parsedToData, argumentsToQueryString } from "../../logic/reporter.js";
import definitionToSettings from "../../adapters/report.js";
import { prepare } from "../../logic/data-handling.js";
import { constantly, trace } from "../../logic/misc.js";

function Template(context, settings) {
    return (context.templates[settings.templateName] || context.templates.MiniPCPTemplate)(context, settings);
}

function Reporter(context, { settings }) {
    const { api, global, Dom, Papa, reportStyleSheetId, page } = context,
          reportId = settings.name,
          dataUrl = `${ api.protocol }://${ api.host }${ api.baseUrl }/reports/${ reportId }/data`,
          template = Template(context, settings),
          iFrameDocument = page.iFrameDocument();

    function fetch(queryString) {
        return global.fetch(
            dataUrl + (queryString ? "?" + queryString : ""),
            { method: "GET", mode: "cors" }
        ).then(r => r.text());
    }

    function render(data) {
        return Dom(
            { ...context, uuidGen: constantly(reportStyleSheetId), document: iFrameDocument },
            template.render(data),
            template.style
        );
    }

    function reportRenderNode() {
        return page.iFrameDocument().getElementById(context.renderNodes.reportBody);
    }

    function report(reportArguments) {
        page.showReport();
        fetch(argumentsToQueryString(reportArguments))
            .then(Papa.parse)
            .then(parsedToData)
            .then(data => prepare(data, settings.data))
            .then(render)
            .then(dom => dom.render(reportRenderNode()));
    }

    return {
        report,
    };
}

export default Reporter;
