function Upload({ document, UIkit }, nodeObj) {
    console.log(nodeObj);
    console.log(`#${nodeObj.id }`);
    const upload = document.getElementById(nodeObj.id),
          bar = document.getElementById(nodeObj.self.private.progressBarId);
    UIkit.upload(
        upload,
        {
            url: "",
            multiple: true,
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
                console.log('completeAll', arguments);

                setTimeout(function() {
                    bar.setAttribute('hidden', 'hidden');
                }, 1000);

                alert('Upload Completed');
            },

        }
    );
}

export default Upload;
