function View(context, view, feature) {
    const { _, Dom, document, messageBroker, topics, actionsFactory, Mask, DatePicker, DataGrid } = context,
          { id, hiccup, actions, events } = view,
          dom = Dom({ ...context, alternativeNodeInitiator }, hiccup),
          node = document.getElementById(context.renderNodes.featuresBody),
          rendered = dom.appendToDomNode(node),
          state = { visible: true };

    function alternativeNodeInitiator(init, nodeObj, context) {

        const nodeInitiators = {
            Mask: maskMethod => Mask(context)[maskMethod](nodeObj, context),
            DatePicker: () => DatePicker(context).init(null, nodeObj, context),
            Grid: gridOptions => DataGrid(context, document.getElementById(nodeObj.id), gridOptions),
        };

        _.each(init, (value, key) => {
            const initiator = nodeInitiators[key];
            if ( initiator ) {
                return initiator(value);
            }
            return nodeObj.self;
        });
    }

    function setAction(action) {
        const element = document.getElementById(action.elementId);
        (element || {})[action.event] = actionsFactory.new(action, self, feature);
    }

    function setActions() {
        actions?.forEach(setAction);
    }

    function show() {
        if ( ! state.visible ) {
            node.appendChild(rendered);
            state.visible = true;
        }
        messageBroker.produce(`view-${ id }-show`, state);
    }

    function hide() {
        if ( state.visible ) {
            node.removeChild(rendered);
            state.visible = false;
        }
    }

    function setContent(parentId, _content) {
        const content = _.isArray(_content) ? _content : ["span", _content];
        const dom = context.Dom(context, content);
        return dom.render(parentId);
    }

    function init() {
        setActions();
        show();
    }

    init();
    return {
        id,
        show,
        hide,
        setContent,
    };
}

export default View;
