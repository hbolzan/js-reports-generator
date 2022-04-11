const fetchOptions = {
    mode: "cors",
    errorMessage: "ATENÇÃO: A funcionalidade selecionada não está disponível"
};

async function Feature(context, featureId) {
    const { httpClient, config, api, Dom } = context,
          node = context.document.getElementById(context.renderNodes.featuresBody),
          state = {
              definition: null,
              doms: {},
              active: null,
              rendered: {},
          };

    function removeActive() {
        if ( state.active ) {
            node.removeChild(state.active);
            state.active = null;
            state.activeViewId = null;
        }
    }

    async function fetch() {
        const featureUrl = config.apiUrl(api.feature(featureId)),
              feature = await httpClient.GET(featureUrl, fetchOptions);
        return feature.json();
    }

    state.definition = await fetch();

    function render(viewId) {
        if ( ! state.doms[viewId] ) {
            state.doms[viewId] = Dom(context, state.definition.views[viewId]);
        }
    }

    function show(requiredViewId) {
        const viewId = requiredViewId || state.activeViewId || 0;
        removeActive();
        render(viewId);
        if ( ! state.rendered[viewId] ) {
            state.rendered[viewId] = state.doms[viewId].appendToDomNode(node);
        } else {
            node.appendChild(state.rendered[viewId]);
        }
        state.active = state.rendered[viewId];
        state.activeViewId = viewId;
    }

    return {
        state,
        show,
        hide: removeActive,
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
