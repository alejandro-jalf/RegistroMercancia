document.addEventListener("DOMContentLoaded", () => {
    const initLector = () => {
        Quagga.init({
            inputStream: {
                constraints: {
                    width: 550,
                    height: 550,
                },
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#lector'), // Pasar el elemento del DOM
            },
            decoder: {
                readers: ["ean_reader"]
            }
        }, function (err) {
            if (err) {
                console.log(err);
                return
            }
            Quagga.start();
        });
    
        Quagga.onDetected((data) => {
            sound.play();
            app.CodigoBarrasName = data.codeResult.code;
            window.navigator.vibrate(200);
            Quagga.stop();
            app.scannerActivo = false;
        });
    }
    objectQuagga.initQuagga = initLector;
});
