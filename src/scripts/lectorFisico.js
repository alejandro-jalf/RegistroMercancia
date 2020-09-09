$(document).ready(function() {
     //$("#bCode").scannerDetection();

    console.log('all is well');
    
    $(window).scannerDetection();
    $(window).bind('scannerDetectionComplete',function(e,data){
        console.log('complete '+data.string);
        $("#bCode").val(data.string);
    })
    .bind('scannerDetectionError',function(e,data){
        console.log('detection error '+data.string);
    })
    .bind('scannerDetectionReceive',function(e,data){
        console.log('Recieve');
        console.log(data.evt.which);
    });

    //$(window).scannerDetection('success');
});