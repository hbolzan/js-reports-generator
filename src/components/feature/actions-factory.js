function ActionsFactory({ _, document, UIkit, messageBroker }) {

    const actions = {
        alert: (args, feature) => () => UIkit.modal.alert(args.message),
        nav: (args, feature) => () => {
            gatherInputs(args, feature);
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

    function setListener(args, feature, view) {
        if ( args && feature && view ) {
            console.log(args);
            messageBroker.listen( `view-${ view.id }-${ args.event }`, s => setContent(args, feature, view, s));
        }
    }

    function newAction(action, view, feature) {
        const { type, event, args } = action,
              mainAction = actions[type](args, feature, view);
        return  () => {
            gatherInputs(args, feature);
            mainAction();
        };
    }

    return {
        new: newAction,
    };
}

export default ActionsFactory;
