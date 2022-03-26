function Auth(context) {
    const data = {},
          { global, api, browserFingerprint, messageBroker } = context,
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

    function handleAuthentication(res, topic) {
        data.auth = {};
        if ( res.status == 200 ) {
            data.auth = JSON.parse(res.headers.get("auth"));
            saveAuthData(data);
            refreshWhileYouCan(data);
            messageBroker.produce(topic, data);
        } else {
            messageBroker.produce("AUTH.UNAUTHORIZED", {});
        }
    };

    function signIn(userName, password) {
        clearTimeout(data.timedRefresh);
        fetch(
            signInUrl,
            {
                method: "POST",
                mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password, fingerPrint: browserFingerprint })
            }
        ).then(r => handleAuthentication(r, "AUTH.SIGNED-IN"));
    }

    function refresh() {
        const res = fetch(
            refreshUrl,
            {
                method: "POST",
                mode: "cors",
                headers: { "Authorization": `Bearer ${ data?.auth?.token }::${ browserFingerprint }`}
            }
        ).then(r => handleAuthentication(r, "AUTH.REFRESHED"));
    }

    function signOut() {
        data.auth = {};
        saveAuthData(data);
        refresh();
    }

    function refreshWhileYouCan(data) {
        clearTimeout(data.timedRefresh);
        if ( data?.auth?.expiresIn ) {
            data.timedRefresh = setTimeout(refresh, (data.auth.expiresIn-15)*1000);
        }
    }

    function authorizationHeader() {
        return { "Authorization": `Bearer ${ data?.auth?.token }::${ browserFingerprint }`};
    }

    function GET(url) {
        const res = fetch(
            url,
            {
                cache: "no-cache",
                headers: { "Authorization": `Bearer ${ data?.auth?.token }::${ browserFingerprint }`}
            }
        );
        res.then(r => {
            data.lastResponse = r;
            r.json().then(j => data.lastBody = j);
        });
    }

    recoverAuth();
    messageBroker.listen("AUTH.SIGN-OUT-REQUESTED", signOut);

    return {
        signIn,
        refresh,
        authorizationHeader,
        GET,
    };
}

export default Auth;
