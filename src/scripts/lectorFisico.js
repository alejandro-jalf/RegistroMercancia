$(document).ready(function() {
     //$("#CodigoBarras").scannerDetection();

    console.log('all is well');

    const start = () => {
        $(window).scannerDetection();
        $(window).bind('scannerDetectionComplete',function(e,data){
            console.log('complete '+data.string);
            $("#CodigoBarras").val(data.string);
        })
        .bind('scannerDetectionError',function(e,data){
            console.log('detection error '+data.string);
        })
        .bind('scannerDetectionReceive ',function(e,data){
            console.log('Recieve');
            console.log(data.evt.which);
        });
    }

    const stop = () => {
        $(window).scannerDetection(false);
        $(window).bind('scannerDetectionComplete',function(e,data){
            console.log('Complete Stoped '+data.string);
        })
        .bind('scannerDetectionError',function(e,data){
            console.log('Error Stoped '+data.string);
        })
        .bind('scannerDetectionReceive',function(e,data){
            console.log('Recieve Stoped');
        });
    }

    lectorFisico.start = start;
    lectorFisico.stop = stop;
    //$(window).scannerDetection('success');
});