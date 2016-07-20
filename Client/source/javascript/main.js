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