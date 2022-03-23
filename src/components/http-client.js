import { assocIf } from "../logic/misc.js";

function HttpClient({ global, UIkit }) {
    const fetch = global.fetch;

    function GET(uri, mode, errorMessage) {

        function validateResponse(response) {
            if ( response.status > 299 ) {
                UIkit.modal.alert(errorMessage || `Ocorreu um erro ao acessar o recurso ${ uri }`);
            }
            return response;
        }

        return fetch(uri, assocIf({ method: "GET" }, "mode", mode ))
            .then(validateResponse);
    }

    return {
        GET,
    };
}

export default HttpClient;
