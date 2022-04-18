const fetchOptions = {
    mode: "cors",
};

function ActionsFactory({ _, document, UIkit, config, api, httpClient, messageBroker }) {

    const actions = {
        alert: (args, feature) => () => UIkit.modal.alert(args.message),
        nav: (args, feature) => () => {
            feature.nav(args);
        },
        event: setListener,
    };

    function setContent(args, feature, view, state) {
        const contentKeys = args.setContent.contentKeys,
              nodeIds = args.setContent.nodeIds || [];
        contentKeys?.forEach((k, index) => view.setContent(nodeIds[index], feature.getData(k)));
    }

    function gatherInputs({ gather }, feature) {
        gather?.forEach(g => feature.setData(g.into, document.getElementById(g.from).value));
    }

    async function fetchGet(fetch, feature) {
        const response = await httpClient[fetch.method](
            config.apiUrl(api.actionGet(fetch.from, feature.getData(fetch.withPath))),
            fetchOptions
        );
        return response.json();
    }

    async function fetchAll({ fetch }, feature) {
        return fetch?.reduce(async (result, f) => {
            const content = await fetchGet(f, feature);
            return Object.assign({ ...result, [f.into]: content });
        }, {});
    }

    function setListener(args, feature, view) {
        if ( args && feature && view ) {
            messageBroker.listen( `view-${ view.id }-${ args.event }`, s => setContent(args, feature, view, s));
        }
    }

    function newAction(action, view, feature) {
        const { type, event, args } = action,
              mainAction = actions[type](args, feature, view);
        return  async () => {
            gatherInputs(args, feature);
            feature.mergeData(await fetchAll(args, feature));
            mainAction();
        };
    }

    return {
        new: newAction,
    };
}

export default ActionsFactory;
