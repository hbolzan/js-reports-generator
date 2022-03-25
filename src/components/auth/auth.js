function Auth(context) {
    const data = {},
          { global, api, browserFingerprint } = context,
          signInUrl = `${ api.protocol }://${ api.host }${ api.authSignIn }`,
          refreshUrl = `${ api.protocol }://${ api.host }${ api.authRefresh }`;

    function saveAuthData(data) {
        global.localStorage.setItem("wmrgat", JSON.stringify(data.auth));
    }

    function recoverAuth() {
        // WMRGAT - WebMrp Report Generator Auth Token
        data.auth = JSON.parse(global.localStorage.getItem("wmrgat"));
        refresh();
    }

    function signIn(userName, password) {
        clearTimeout(data.timedRefresh);
        const res = fetch(
            signInUrl,
            {
                method: "POST",
                mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password, browserFingerprint })
            }
        );

        res.then(r => {
            data.auth = {};
            if ( r.status == 200 ) {
                console.log("Authenticated");
                data.auth = JSON.parse(r.headers.get("auth"));
                saveAuthData(data);
                refreshWhileYouCan(data);
            } else {
                console.log("Authentication failed");
            }
        });
    }

    function refresh() {
        console.log("Refreshing...");
        const res = fetch(
            refreshUrl,
            {
                method: "POST",
                mode: "cors",
                headers: { "Authorization": `Bearer ${ data?.auth?.token }::${ browserFingerprint }`}
            }
        );

        res.then(r => {
            data.auth = JSON.parse(r.headers.get("auth"));
            saveAuthData(data);
            refreshWhileYouCan(data);
        });
    }

    function refreshWhileYouCan(data) {
        clearTimeout(data.timedRefresh);
        if ( data?.auth?.expiresIn ) {
            data.timedRefresh = setTimeout(refresh, (data.auth.expiresIn-15)*1000);
        }
    }

    function authorizationHeader() {
        return { "Authorization": `Bearer ${ data?.auth?.token }::${ data?.fingerPrint }`};
    }

    function GET(url) {
        const res = fetch(
            url,
            {
                cache: "no-cache",
                headers: { "Authorization": `Bearer ${ data?.auth?.token }::${ data?.fingerPrint }`}
            }
        );
        res.then(r => {
            data.lastResponse = r;
            r.json().then(j => data.lastBody = j);
        });
    }

    recoverAuth();

    return {
        signIn,
        refresh,
        authorizationHeader,
        GET,
    };
}

export default Auth;
