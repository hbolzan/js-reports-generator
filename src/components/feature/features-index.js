function itemClick(context, reportId) {
    context.ReportParams(context, reportId)
        .get()
        .then(p => context.ReportDialog(context, p).show());
}

function FeaturesIndex(context) {
    const { config, views, httpClient, Dom } = context,
          fetchOptions = { mode: "cors", errorMessage: "ATENÇÃO: O índice de funcionalidades não está disponível" },
          featuresUrl = config.apiUrl("features");

    function index() {
        return httpClient.GET(featuresUrl, fetchOptions)
            .then(r => r.json())
            .then(r => views.commonViews.index(context, r.features, itemClick));
    }

    return {
        index,
    };
}

export default FeaturesIndex;
