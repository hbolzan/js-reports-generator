import View from "./view.js";

const fetchOptions = {
    mode: "cors",
    errorMessage: "ATENÇÃO: A funcionalidade selecionada não está disponível"
};

async function Feature(context, featureId) {
    const { httpClient, config, api, Dom } = context,
          node = context.document.getElementById(context.renderNodes.featuresBody),
          state = {
              definition: null,
              views: {},
              active: null,
              rendered: {},
          };

    async function fetch() {
        const featureUrl = config.apiUrl(api.feature(featureId)),
              feature = await httpClient.GET(featureUrl, fetchOptions);
        return feature.json();
    }

    state.definition = await fetch();

    function show(requiredViewId) {
        const viewId = requiredViewId || state.activeViewId || 0;
        state?.active?.hide();

        if ( ! state.views[viewId] ) {
            state.views[viewId] = View(context, state.definition.views[viewId]);
        }
        state.activeViewId = viewId;
        state.active = state.views[viewId];
        state.active.show();
    }

    return {
        state,
        show,
        hide: () => state?.active?.hide(),
    };
}

function Features(context) {

    const cached = {};

    async function _get(featureId) {
        if ( ! cached[featureId] ) {
            cached[featureId]= await Feature(context, featureId);
        }
        return cached[featureId];
    }

    return {
        get: _get,
    };

}

export default Features;
