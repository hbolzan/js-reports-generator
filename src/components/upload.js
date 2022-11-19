function Upload({ config, document, uuidGen, auth, UIkit }, nodeObj) {
    const priv = nodeObj.self.private,
          { progressBarId, receiveUploadActionId } = priv,
          upload = document.getElementById(nodeObj.id),
          bar = document.getElementById(progressBarId);
    UIkit.upload(
        upload,
        {
            url: config.apiUrl(config.api.actionPerform(receiveUploadActionId)),
            multiple: false,
            beforeSend: env => {
                const uploadId = uuidGen(),
                      element = document.getElementById(nodeObj.id);
                element.lastUploadId = uploadId;
                env.headers = Object.assign({}, auth.authorizationHeader(), { uploadId });
                if ( element.onBeforeSend ) {
                    element.onBeforeSend();
                }
            },
            complete: () => {
            },
            loadStart: e => {
                bar.removeAttribute('hidden');
                bar.max = e.total;
                bar.value = e.loaded;
            },
            progress: e => {
                bar.max = e.total;
                bar.value = e.loaded;
            },
            completeAll: () => {
                setTimeout(function() {
                    bar.setAttribute('hidden', 'hidden');
                }, 1000);

                const element = document.getElementById(nodeObj.id);
                if ( element.onCompleteAll ) {
                    element.onCompleteAll({}, { uploadId: element.lastUploadId });
                }
            },

        }
    );
}

export default Upload;
