import { parsedToData, argumentsToQueryString } from "../../logic/reporter.js";
import definitionToSettings from "../../adapters/report.js";

function Reporter(context, template, reportDefinition) {
    const { api, global, Dom, Papa } = context,
          reportId = reportDefinition.id;
    const dataUrl = `${ api.protocol }://${ api.host }${ api.baseUrl }/reports/${ reportId }/data`;

    function fetch(queryString) {
        return global.fetch(
            dataUrl + (queryString ? "?" + queryString : ""),
            { method: "GET", mode: "cors" }
        ).then(r => r.text());
    }

    function render(data) {
        return Dom(context, template.render(data), template.style);
    }

    function report(reportArguments) {
        console.log(definitionToSettings(reportDefinition));
        fetch(argumentsToQueryString(reportArguments))
            .then(Papa.parse)
            .then(parsedToData)
            .then(console.log);
    }

    return {
        report,
    };
}

export default Reporter;
