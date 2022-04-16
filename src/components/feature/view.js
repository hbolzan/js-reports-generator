function View(context, { id, hiccup, actions }, feature) {
    const { Dom, document, messageBroker, topics, actionsFactory } = context,
          dom = Dom(context, hiccup),
          node = document.getElementById(context.renderNodes.featuresBody),
          rendered = dom.appendToDomNode(node),
          state = { visible: true };

    function setAction({ elementId, type, event, args }) {
        const element = document.getElementById(elementId);
        element[event] = actionsFactory.new(type, args, feature);
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
