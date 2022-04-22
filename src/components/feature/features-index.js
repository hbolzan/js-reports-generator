function FeaturesIndex(context) {
    const { config, api, views, httpClient, Dom } = context,
          state = {},
          fetchOptions = { mode: "cors", errorMessage: "ATENÇÃO: O índice de funcionalidades não está disponível" },
          featuresUrl = config.apiUrl(api.features);

    async function removeActive() {
        if ( state.activeFeatureId ) {
            const active = await context.features.get(state.activeFeatureId);
            active.hide();
        }
    }

    async function itemClick(context, featureId) {
        const feature = await context.features.get(featureId);
        await removeActive();
        state.activeFeatureId = featureId;
        feature.show();
    }

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
