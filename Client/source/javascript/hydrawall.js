var Hydrawall = function () {

    var self = this;
    document.title = $(window).width()+" x "+$(window).height()

    this.loadGifs($('#container1'));
    this.loadGifs($('#container2'));

    this.theBool = true;

    setTimeout(function(){
        self.show($('#container1'));
        self.hide($('#container2'));
        self.loop();
    },1000);



}


Hydrawall.prototype.loadGifs = function (container) {

    container.html('');
/*
    $.getJSON( "https://christianhotz.de/gifs/info?width="+$(window).width()+"&height="+$(window).height(), function( data ) {
      $.each( data, function( key, val ) {
          container.append("<img src='"+key+"' style=' width:"+val.width+"px; height:"+val.height+"px;  top:"+val.y+"px; left:"+val.x+"px;'>")
      });
    });
*/

    $.getJSON( "http://" + location.host + "/gifs/info?width="+$(window).width()+"&height="+$(window).height(), function( data ) {
      $.each( data, function( key, val ) {
          container.append("<img src='"+key+"' style=' width:"+val.width+"px; height:"+val.height+"px;  top:"+val.y+"px; left:"+val.x+"px;'>")
      });
    });

}

Hydrawall.prototype.hide = function (container) {
    var self = this;
    container.find('img').each(function(){
        var delay = Math.random();
        TweenMax.to($(this), 0.05, {opacity:0, delay: delay});
    });
    setTimeout(function(){
        self.loadGifs(container);
    },1000);
}

Hydrawall.prototype.show = function (container) {
    container.find('img').each(function(){
        var delay = Math.random();
        TweenMax.to($(this), 0.05, {opacity:1, delay: delay});
    });
}

Hydrawall.prototype.loop = function () {
    var self = this;
    setTimeout(function(){

        if (self.theBool){
            self.show($('#container1'));
            self.hide($('#container2'));
        } else {
            self.show($('#container2'));
            self.hide($('#container1'));
        }

        self.theBool = !self.theBool;
        self.loop();

    },20000);
}