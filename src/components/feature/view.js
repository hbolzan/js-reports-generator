function ActionsFactory({ UIkit }) {
    const actions = {
        alert: (data, feature) => () => UIkit.modal.alert(data.message),
        next: (data, feature) => () => feature.showNextView(),
        prior: (data, feature) => () => feature.showPriorView(),
    };

    return {
        new: (type, data, feature) => actions[type](data, feature),
    };
}

function View(context, { id, hiccup, actions }, feature) {
    const { Dom, document, messageBroker, topics } = context,
          dom = Dom(context, hiccup),
          actionsFactory = ActionsFactory(context),
          node = document.getElementById(context.renderNodes.featuresBody),
          rendered = dom.appendToDomNode(node),
          state = { visible: true };

    function setAction({ elementId, type, event, data }) {
        const element = document.getElementById(elementId);
        element[event] = actionsFactory.new(type, data, feature);
    }

    function setActions() {
        actions?.forEach(setAction);
    }

    function show() {
        if ( ! state.visible ) {
            node.appendChild(rendered);
            state.visible = true;
        }
    }

    function hide() {
        if ( state.visible ) {
            node.removeChild(rendered);
            state.visible = false;
        }
    }

    function setContent(parentId, content) {
        const dom = context.Dom(context, content);
        return dom.render(parentId);
    }

    function init() {
        setActions();
    }
    init();

    return {
        show,
        hide,
        setContent,
    };
}

export default View;
