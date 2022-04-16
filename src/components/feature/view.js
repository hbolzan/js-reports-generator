function View(context, hiccup) {
    const dom = context.Dom(context, hiccup),
          node = context.document.getElementById(context.renderNodes.featuresBody),
          rendered = dom.appendToDomNode(node),
          state = { visible: true, };

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

    return {
        show,
        hide,
    };
}

export default View;
