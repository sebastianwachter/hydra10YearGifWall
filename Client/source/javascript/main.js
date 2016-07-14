
/*$('.item').each(function () {
    /*
    let width = Math.floor(Math.random() * (600 - 150)) + 150;
    let height = Math.floor(Math.random() * (600 - 150)) + 150;
    

    $.getJSON('http://christianhotz.de/gifs/info', function (data) {
        var url = data.basePath;
        var people = data.people;
        var funny = data.funny.gifs;
        console.log(url);
        console.log(people);
        console.log(funny);
        $.each($.parseJSON(data), function(key,value){
            console.log(this);
        });
    });

    //$(this).append('<img src="http://lorempixel.com/' + width + '/' + height + '">');

    $(this).css({
        'width': width,
        'height': height
    });
});*/

$.getJSON('http://christianhotz.de/gifs/info', function (data) {
    var url = data.basePath;
    var people = data.people;
    var funny = data.funny.gifs;
    /*console.log(url);
    console.log(people);
    console.log(funny);*/

    var count = 0;
    var keyNames = _.keys(people.gifs);
    $('.item.notset').each(function () {
        var grain = keyNames[count];
        console.log(grain);
        var grainWidth = people.gifs[grain].width;
        var grainHeight = people.gifs[grain].height;
        $(this).append('<img src="'+ url + '/' + people.path + '/' + grain + '">');
        $(this).css({
            'width': grainWidth,
            'height': grainHeight
        });
        count++;
        $(this).removeClass('notset');
    });

    var keyNames = _.keys(funny.gifs);
    $('.item.notset').each(function () {
        var grain = keyNames[count];
        console.log(grain);
        var grainWidth = funny.gifs[grain].width;
        var grainHeight = funny.gifs[grain].height;
        $(this).append('<img src="'+ url + '/' + funny.path + '/' + grain + '">');
        $(this).css({
            'width': grainWidth,
            'height': grainHeight
        });
        count++;
        $(this).removeClass('notset');
    });
    /*console.log(_.keys(people.gifs));
    $.each(people.gifs, function () {
        console.log((this));
    });*/

    //$('.item.notset').append('<img src="'+ url + '/' + people.path + '/' + 'baseball00013.gif">').css({'width': people.gifs[0].width, 'height': people.gifs.baseball00013[0].gif.height});
});