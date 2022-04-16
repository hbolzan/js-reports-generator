function ActionsFactory({ _, document, UIkit }) {
    function gatherInputs({ gather }, feature) {
        gather?.forEach(g => feature.setData(g.into, document.getElementById(g.from).value));
    }

    const actions = {
        alert: (args, feature) => () => UIkit.modal.alert(args.message),
        nav: (args, feature) => () => {
            gatherInputs(args, feature);
            feature.nav(args);
        },
    };

    return {
        new: (type, args, feature) => actions[type](args, feature),
    };
}

export default ActionsFactory;
