// JavaScript source code
(function ($) {

    // ------ Plugin function ------

    $.fn.setGMap = function (options) {

        var settings = $.extend({}, $.fn.setGMap.defaults, options);

        return this.each(function () {
            var map = new Map($(this), settings);
            
            var addMarkerToMapPrepared = function (event, map) {
                settings.map = map;
                addMarkerToMap(event, settings);
            };
            
            map.initialize(settings, addMarkerToMapPrepared);
        });
    };

    
    function addMarkerToMap(event, pluginSettings) {
        debugger;
        if (!pluginSettings.maxMarkers || map.markers.length < pluginSettings.maxMarkers) {

            var markerOptions = {
                message: pluginSettings.defaultMessage,

                // alternative 3
                position: event.latLng,

                map: pluginSettings.map,
                icon: pluginSettings.icon,
                isEditable: pluginSettings.editableMarkers
            };
            
            markerOptions.map.markers = markerOptions.map.markers || [];

            var newMarker = new Marker(markerOptions);

            newMarker.addInfoWindow(pluginSettings);
            newMarker.addEvents();

            markerOptions.map.markers.push(newMarker);
        }
    }
    
    


    function testPolygonDrawing(map) {

        var polygonDots = [
            {
                x: -5.0,
                y: -5.0
            },
            {
                x: -5.0,
                y: 5.0
            },
            {
                x: 5.0,
                y: -5.0
            },
            {
                x: 5.0,
                y: 5.0
            }
        ];

        var polygon = new Polygon(polygonDots, map);
        polygon.drawAroundPivot(getLatitudes('Minsk'));
    }
    
    


    // ------ Defaults ------

    var $markerContentSource = $(
        '<div class="marker-content source">' +
            '<div class="marker-message-group source">' +
                '<div class="marker-label source"></div>' +
            '</div>' +

            '<div class="clearfix"></div>' +
            '<div class="marker-input-group source">' +
                '<label for="marker-input" >Message:</label>' +
                '<input type="text" name="marker-input" class="marker-input source" />' +
            '</div>' +

        '</div>'
        );

    $.fn.setGMap.defaults = {
        startPlace: 'Minsk',
        zoom: 8,
        mapType: 'road',
        //markers
        maxMarkers: undefined,
        editableMarkers: true,
        icon: undefined,
        defaultMessage: '',
        $markerContent: $markerContentSource,
        $markerInput: undefined,
        $markerLabel: undefined,
        defaultMarkers: [],
        //search
        searchable: false,
        $searchButton: $('#search-button'),
        $searchText: $('#search-text')
    };

})(jQuery);