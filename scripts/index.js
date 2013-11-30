$(document).ready(function () {

    var currentAreaRadius = 0;

    var wifiMap = new WifiMap();
    wifiMap.clickCallback = function (event) {
        wifiMap.addBaseStation(event.latLng, Number($('#amount').val()));
    };
    wifiMap.initialize();

    
    // slider
    $('.slider').slider({       
        value: 100,
        min: 0,
        max: 500,
        step: 50,
        slide: function (event, ui) {
            console.log('slide');
            currentAreaRadius = +ui.value;
            $(this).parent().find('.amount').val(ui.value);
        }
    });

   // menu
    var ui = function(app, events) {
        var $menuBtn = $('.show-menu');
        var $body = $('body');
        var menuOpen = false;

        $menuBtn
            .on('mouseenter', function () {
                $body.addClass('menu', 500);
                menuOpen = true;
            })
            .on('mouseleave', function() {
                $body.removeClass('menu', 500);
                menuOpen = false;
            });
    }();
});