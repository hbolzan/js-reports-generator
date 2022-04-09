async function itemClick(context, featureId) {
    const feature = await context.feature.get(featureId);
    console.log(feature);
}

function FeaturesIndex(context) {
    const { config, api, views, httpClient, Dom } = context,
          fetchOptions = { mode: "cors", errorMessage: "ATENÇÃO: O índice de funcionalidades não está disponível" },
          featuresUrl = config.apiUrl(api.features);

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
