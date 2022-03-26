function AuthDialog(context) {
    const { document, uuidGen, UIkit, Modal, Dom, messageBroker, auth } = context,
          dialogNode = document.getElementById(context.renderNodes.dialog),
          modalObj = {};

    function dlgInput(caption, id) {
        return ["div", { class: ["uk-margin"] },
                ["label", { class: ["uk-text-bold", "uk-form-label"] }, caption],
                ["div", { class: ["uk-form-controls"] },
                 ["input", { id, class: ["uk-input"] }]]];
    }

    function dlgForm() {
        return ["form", { class: ["uk-form-stacked"] },
                ["div", { class: ["uk-form-controls"] },
                 dlgInput("Nome de usuário", "sign-in-user"),
                 dlgInput("Senha", "sign-in-password")]];
    }

    function signIn() {
        const userName = document.getElementById("sign-in-user").value,
              password = document.getElementById("sign-in-password").value;
        console.log(userName, password);
        auth.signIn(userName, password);
    }

    function footer(modalObj) {
        return ["div", {
            href: "",
            onclick: signIn,
            class: ["uk-button", "uk-button-primary", "uk-button-large", "uk-align-right"]
        },
                ["span", { ukIcon: "unlock"}],
                ["span", { class: ["uk-margin-small-left"] }, "ENTRAR"]];
    }

    function show() {
        document.getElementById("sign-in-user").value = "";
        document.getElementById("sign-in-password").value = "";
        modalObj.modal.show();
    }

    function init() {
        const buttonId = uuidGen();
        modalObj.modal = Modal(context, {
            title: "Autenticação de usuário",
            body: dlgForm(),
            footer: footer(modalObj),
            withCloseButton: false,
        });
        messageBroker.listen("AUTH.SIGNED-IN", data => modalObj.modal.hide());
        messageBroker.listen("AUTH.REFRESHED", data => modalObj.modal.hide());
        messageBroker.listen("AUTH.UNAUTHORIZED", () => show());
    }

    init();

    return {
        dialog: () => show(),
    };
}

export default AuthDialog;
