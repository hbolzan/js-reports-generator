function AuthDialog(context) {
    const { document, uuidGen, UIkit, Modal, Dom } = context,
          dialogNode = document.getElementById(context.renderNodes.dialog);

    function dlgInput(caption) {
        return ["div", { class: ["uk-margin"] },
                ["label", { class: ["uk-text-bold", "uk-form-label"] }, caption],
                ["div", { class: ["uk-form-controls"] },
                 ["input", { class: ["uk-input"] }]]];
    }

    function dlgForm() {
        return ["form", { class: ["uk-form-stacked"] },
                ["div", { class: ["uk-form-controls"] },
                 dlgInput("Nome de usuário"),
                 dlgInput("Senha")]];
    }

    function footer(modalObj) {
        return ["div", {
            href: "",
            onclick: () => modalObj.modal.hide(),
            class: ["uk-button", "uk-button-primary", "uk-button-large", "uk-align-right"]
        },
                ["span", { ukIcon: "unlock"}],
                ["span", { class: ["uk-margin-small-left"] }, "ENTRAR"]];
    }

    let modalObj = {};
    function init() {
        const buttonId = uuidGen();
        modalObj.modal = Modal(context, {
            title: "Autenticação de usuário",
            body: dlgForm(),
            footer: footer(modalObj),
            withCloseButton: false,
        });
    }

    init();

    return {
        dialog: () => modalObj.modal.show(),
    };
}

export default AuthDialog;
