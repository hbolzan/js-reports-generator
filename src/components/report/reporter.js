import { parsedToData } from "../../logic/reporter.js";

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

    function report(queryString) {
        console.log(reportDefinition);
        fetch(queryString)
            .then(Papa.parse)
            .then(parsedToData)
            .then(console.log);
    }

    return {
        report,
    };
}

export default Reporter;
