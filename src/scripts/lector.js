document.addEventListener("DOMContentLoaded", () => {
    const initLector = () => {
        Quagga.init({
            inputStream: {
                constraints: {
                    width: 1920,
                    height: 1080,
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
            window.navigator.vibrate(500);
            Quagga.stop();
            app.scannerActivo = false;
            app.textButtonScanner = "Scanner";
        });
    }
    objectQuagga.initQuagga = initLector;
});
