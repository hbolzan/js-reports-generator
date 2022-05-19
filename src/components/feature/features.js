import View from "./view.js";

const fetchOptions = {
    mode: "cors",
    errorMessage: "ATENÇÃO: A funcionalidade selecionada não está disponível"
};

async function Feature(context, featureId) {
    let self;
    const { _, httpClient, config, api, Dom, messageBroker, topics } = context,
          node = context.document.getElementById(context.renderNodes.featuresBody),
          state = {
              definition: null,
              views: {},
              active: null,
              rendered: {},
          };

    function setData(key, value) {
        state.data = { ...(state.data || {}), [key]: value };
    }

    function mergeData(data) {
        state.data = { ...(state.data || {}), ...data };
    }

    async function fetch() {
        const featureUrl = config.apiUrl(api.feature(featureId)),
              feature = await httpClient.GET(featureUrl, fetchOptions);
        return feature.json();
    }

    function show(requiredViewOrder) {
        const viewOrder = requiredViewOrder ?? state.activeViewOrder ?? 0;
        state?.active?.hide();

        if ( ! state.views[viewOrder] ) {
            state.views[viewOrder] = View(context, state.definition.views[viewOrder], self);
        }
        state.activeViewOrder = viewOrder;
        state.active = state.views[viewOrder];
        state.active.show();
    }

    function showNextView() {
        const nextOrder = (state.activeViewOrder ?? -1) + 1;
        if ( nextOrder < state.definition.views.length ) {
            show(nextOrder);
        }
    }

    function showPriorView() {
        const priorOrder = (state.activeViewOrder ?? 0) - 1;
        if ( priorOrder >= 0 ) {
            show(priorOrder);
        }
    }

    const navActions = {
        next: showNextView,
        prior: showPriorView,
    };

    function nav(actionArgs) {
        navActions[actionArgs.navType]();
    }

    async function init() {
        state.definition = await fetch();
        messageBroker.listen(topics.AUTH__SIGNED_OUT, () => state?.active?.hide());
    }
    await init();

    self = {
        state,
        show,
        nav,
        showNextView,
        showPriorView,
        hide: () => state?.active?.hide(),
        setData,
        mergeData,
        getData: k => _.get((state?.data || {}), k),
    };

    return self;
}

function Features(context) {

    const { messageBroker, topics } = context,
          cached = new Map();

    messageBroker.listen(topics.AUTH__SIGNED_OUT, () => cached.clear());

    async function _get(featureId) {
        if ( ! cached.get(featureId) ) {
            cached.set(featureId, await Feature(context, featureId));
        }
        return cached.get(featureId);
    }

    return {
        get: _get,
        clearCache: () => cached.clear(),
    };

}

export default Features;
