function Upload({ config, document, auth, UIkit }, nodeObj) {
    console.log(nodeObj);
    console.log(`#${nodeObj.id }`);
    const priv = nodeObj.self.private,
          { progressBarId, receiveUploadActionId } = priv,
          upload = document.getElementById(nodeObj.id),
          bar = document.getElementById(progressBarId);
    UIkit.upload(
        upload,
        {
            url: config.apiUrl(config.api.actionPerform(receiveUploadActionId)),
            multiple: true,
            beforeSend: env => {
                env.headers = auth.authorizationHeader();
            },
            complete: () => {
                console.log("complete", arguments);
            },
            loadStart: e => {
                console.log('loadStart', arguments);

                bar.removeAttribute('hidden');
                bar.max = e.total;
                bar.value = e.loaded;
            },
            progress: e => {
                console.log('progress', arguments);

                bar.max = e.total;
                bar.value = e.loaded;
            },
            completeAll: () => {
                const element = document.getElementById(nodeObj.id);

                setTimeout(function() {
                    bar.setAttribute('hidden', 'hidden');
                }, 1000);

                element.onCompleteAll();
            },

        }
    );
}

export default Upload;
