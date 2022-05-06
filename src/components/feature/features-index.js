function FeaturesIndex(context) {
    const { UIkit, document, config, renderNodes, topics, api, messageBroker, views, httpClient, Dom } = context,
          state = {},
          fetchOptions = { mode: "cors", errorMessage: "ATENÇÃO: O índice de funcionalidades não está disponível" },
          featuresUrl = config.apiUrl(api.features);

    async function removeActive() {
        if ( state.activeFeatureId ) {
            const active = await context.features.get(state.activeFeatureId);
            active.hide();
        }
    }

    async function _showFeature(context, featureId) {
        const feature = await context.features.get(featureId);
        await removeActive();
        state.activeFeatureId = featureId;
        feature.show();
    }

    async function itemClick(context, featureId) {
        await _showFeature(context, featureId);
    }

    async function showFeature(featureId) {
        document.getElementById(renderNodes.mainIndexFeaturesTab).click();
        await _showFeature(context, featureId);
    }

    function index() {
        return httpClient.GET(featuresUrl, fetchOptions)
            .then(r => r.json())
            .then(r => views.commonViews.index(context, r.features, itemClick));
    }

    messageBroker.listen(topics.FEATURES__ACTIVATION_REQUESTED, m => showFeature(m.featureId));

    return {
        index,
        showFeature,
    };
}

export default FeaturesIndex;
