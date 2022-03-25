function modalContainer(title, body, footer, withCloseButton, mainContainerId) {
    const mainContainerAttrs = Object.assign(
        { class: ["uk-modal-container"], ukModal: "uk-modal" },
        mainContainerId ? { id: mainContainerId } : {}
    );

    const closeButton = ["button", { class: ["uk-modal-close-default"], type: "close", ukClose:"uk-close" }];
    return ["div", mainContainerAttrs,
            ["div", { class: ["uk-modal-dialog", "uk-modal-body", "uk-margin-auto-vertical"] },
             ...(withCloseButton ? [closeButton] : []),
             ["h3", { class: ["uk-modal-title"] }, title],
             ["div", { class: ["uk-modal-body"] },
              body],
             ["div", { class: ["uk-modal-footer"] },
              footer]]];
}

function Modal(context, { title, body, footer, withCloseButton }) {
    let initialized = false,
        self = {};
    const { document, Dom, UIkit, uuidGen } = context,
          dom = Dom(context, modalContainer(title, body, footer, withCloseButton)),
          modal = UIkit.modal(
              dom.appendToDomNode(document.getElementsByTagName("body")[0]),
              { bgClose: false }
          );

    return Object.assign(
        self,
        {
            dom,
            show: modal.show,
            hide: modal.hide,
        }
    );
};

export default Modal;
