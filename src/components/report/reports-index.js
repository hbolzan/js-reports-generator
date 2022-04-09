function itemClick(context, reportId) {
    context.ReportParams(context, reportId)
        .get()
        .then(p => context.ReportDialog(context, p).show());
}

function ReportsIndex(context) {
    const { config, views, httpClient, Dom } = context,
          fetchOptions = { mode: "cors", errorMessage: "ATENÇÃO O índice de relatórios não está disponível" },
          reportsUrl = config.apiUrl("reports");

    function index() {
        return httpClient.GET(reportsUrl, fetchOptions)
            .then(r => r.json())
            .then(r => views.commonViews.index(context, r.reports, itemClick));
            // .then(index => views.commonViews.tabs(context, { reports: index, features: [] }))
            // .then(fullIndex => Dom(context, fullIndex));
    }

    return {
        index,
    };
}

export default ReportsIndex;
