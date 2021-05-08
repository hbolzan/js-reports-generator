function Reporter(context, template, reportDefinition) {
    const { api, global } = context,
          reportId = reportDefinition.id;
    const dataUrl = `${ api.protocol }://${ api.host }${ api.baseUrl }/reports/${ reportId }/data`;

    function report(data) {
        return context.Dom(context, template.render(data), template.style);
    }

    function fetch(queryString) {
        return global.fetch(
            dataUrl + (queryString ? "?" + queryString : ""),
            { method: "GET", mode: "cors" }
        ).then(r => r.text());
    }

    return {
        fetch,
        report,
    };
}

export default Reporter;
