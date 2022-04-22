function itemClick(context, reportId) {
    context.ReportParams(context, reportId)
        .get()
        .then(p => context.ReportDialog(context, p).show());
}

function ReportsIndex(context) {
    const { config, api, views, httpClient, Dom } = context,
          fetchOptions = { mode: "cors", errorMessage: "ATENÇÃO O índice de relatórios não está disponível" },
          reportsUrl = config.apiUrl(api.reports);

    function index() {
        return httpClient.GET(reportsUrl, fetchOptions)
            .then(r => r.json())
            .then(r => views.commonViews.index(context, r.reports, itemClick));
    }

    return {
        index,
    };
}

export default ReportsIndex;
