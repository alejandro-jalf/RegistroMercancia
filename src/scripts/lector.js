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
                facingMode: "environment",
                target: document.querySelector('#lector'), // Pasar el elemento del DOM
                area: { // defines rectangle of the detection/localization area
                  top: "30%",    // top offset
                  right: "0%",  // right offset
                  left: "0%",   // left offset
                  bottom: "30%"  // bottom offset
                },
            },
            decoder: {
                readers: ["ean_reader"]
            },
            locator: {
                halfSample: true,
                patchSize: "medium" // x-small, small, medium, large, x-large
            }
        }, function (err) {
            if (err) {
                console.log(err);
                return
            }
            Quagga.start();
            const video = document.querySelector('#lector');
            const track1 = Quagga.CameraAccess.getActiveTrack();
            console.log(track1);
            video.addEventListener('loadedmetadata', (e) => {
                window.setTimeout(() => (
                    onCapabilitiesReady(track.getCapabilities())
                ), 500);
            });
            
            function onCapabilitiesReady(capabilities) {
                app.console = "data:"+capabilities;
            }

            // function onCapabilitiesReady(capabilities) {
            //     if (capabilities.zoom) {
            //         track.applyConstraints({
            //         advanced: [{zoom: capabilities.zoom.max}]
            //     })
            //         .catch(e => console.log(e));
            //     }
            // }

            // navigator.mediaDevices.getUserMedia({  
            //     video: {
            //       facingMode: 'environment',
            //     }
            //   })
            //   .then((stream) => {
            //     const video = document.querySelector('#lector');
            //     video.srcObject = stream;

            //     const track = stream.getVideoTracks()[0];
            //     console.log(track); //MediaStreamTrack { kind: "video", id: "{deb72b1a-9ab9-4247-b5f0-0fc5438c7eca}", label: "HP Truevision HD", enabled: true, muted: false, onmute: null, onunmute: null, readyState: "live", onended: null }
            //     video.addEventListener('loadedmetadata', (e) => {
            //         window.setTimeout(() => (
            //           onCapabilitiesReady(track.getCapabilities())
            //         ), 500);
            //       });
            //       function onCapabilitiesReady(capabilities) {  
            //         console.log("data:"+capabilities);
            //       }
            //   })
            //   .catch(err => console.error('getUserMedia() failed: ', err));
        });
    
        Quagga.onDetected((data) => {
            sound.play();
            app.CodigoBarrasName = data.codeResult.code;
            window.navigator.vibrate(500);
            Quagga.stop();
            app.scannerActivo = false;
            app.textButtonScanner = "Scanner";
        });

        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });
    }
    objectQuagga.initQuagga = initLector;
});
