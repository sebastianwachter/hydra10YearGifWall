var Hydrawall = function () {

    //var obj = jQuery.parseJSON( https://christianhotz.de/gifs/info?width=1920&height=1080 );
    //alert( obj.name === "John" );

    document.title = $(window).width()+" x "+$(window).height()

    $.getJSON( "https://christianhotz.de/gifs/info?width="+$(window).width()+"&height="+$(window).height(), function( data ) {
      $.each( data, function( key, val ) {
          $('body').append("<img src='"+key+"' style=' width:"+val.width+"px; height:"+val.height+"px;  top:"+val.y+"px; left:"+val.x+"px;'>")
      });

    });

}


Hydrawall.prototype.setPoints = function () {



}

/*
$('#contianer').css({
    'width': $(document).width(),
    'height': $(document).height()
});

$('.item').each(function () {
    let width = Math.floor(Math.random() * (600 - 150)) + 150;
    let height = Math.floor(Math.random() * (600 - 150)) + 150;

    //$(this).append('<img src="http://lorempixel.com/' + width + '/' + height + '">');

    $(this).css({
        'width': width,
        'height': height
    });
});
*/