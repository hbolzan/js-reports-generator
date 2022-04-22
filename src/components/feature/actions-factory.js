import { isEmpty } from "../../logic/misc.js";

const baseOptions = {
    mode: "cors",
    headers: { 'Content-Type': 'application/json' },
};

function ActionsFactory({ _, document, UIkit, config, api, httpClient, messageBroker }) {

    const actions = {
        alert: (args, feature) => () => UIkit.modal.alert(args.message),
        nav: (args, feature) => () => {
            feature.nav(args);
        },
        perform: (args, feature, view) => () => perform(args, feature, view),
        event: setListener,
    };

    function setContent(args, feature, view) {
        const contentKeys = args.setContent.contentKeys,
              nodeIds = args.setContent.nodeIds || [];
        contentKeys?.forEach((k, index) => view.setContent(nodeIds[index], feature.getData(k)));
    }

    function gatherInputs({ gather }, feature) {
        gather?.forEach(g => feature.setData(g.into, document.getElementById(g.from).value));
    }

    function gatherChildren({ gather }, feature) {
        const children = document.getElementById(gather.from).getElementsByTagName("input"),
              data = Array.from(children).map(i => ({ id: i.id, name: i.name, value: i.value, checked: i.checked }));
        feature.setData(gather.into, data);
    }

    function fetchUrl(fetch, feature) {
        return config.apiUrl(
            ( fetch.method === "GET" && fetch.withPath ) ?
                api.actionGet(fetch.from, feature.getData(fetch.withPath)) :
                api.actionPerform(fetch.from)
        );
    }

    function fetchOptions(fetch, body) {
        return ( _.isEmpty(body) || fetch.method === "GET" ) ?
            baseOptions :
            { ...baseOptions, body };
    }

    async function fetchPerform(fetch, feature) {
        const body = fetch.withBody?.reduce((b, k) => ({ ...b, [k]: feature.getData(k) }), {}),
              response = await httpClient[fetch.method](
                  fetchUrl(fetch, feature),
                  fetchOptions(fetch, body)
              );
        return response.json();
    }

    async function fetchOne(fetch, feature) {
        const content = await fetchPerform(fetch, feature);
        feature.setData(fetch.into, content);
    }

    async function fetchAll({ fetch }, feature) {
        if ( ! fetch ) {
            return {};
        }
        let content;
        const result = { data: {} };
        for (const f of fetch) {
            content = await fetchPerform(f, feature);
            result.data = { ...result.data, [f.into]: content };
        }
        return result.data;
    }

    async function perform({ actions }, feature, view) {
        let content;
        for (const action of actions) {
            if ( action.type === "fetch" ) {
                content = await fetchOne(action, feature);
            } else if ( action.type === "setContent" ) {
                setContent(action, feature, view);
            } else if ( action.type === "gatherChildren" ) {
                gatherChildren(action, feature);
            }
        }
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
            const data = await fetchAll(args, feature);
            feature.mergeData(data);
            mainAction();
        };
    }

    return {
        new: newAction,
    };
}

export default ActionsFactory;
