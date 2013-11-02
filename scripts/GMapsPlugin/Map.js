function Map($sourceObject, settings) {
    var self = {};
    
    self.$sourceObject = $sourceObject;
    self.googleMap = undefined;

    
    
    self.initialize = function (initSettings, clickCallbackWithMap) {
        
        console.log('initialize map');
        

        var roadMapTypes = {
            'road': google.maps.MapTypeId.ROADMAP,
            'hybrid': google.maps.MapTypeId.HYBRID
        };
        var mapOptions = {
            zoom: settings.zoom,
            mapTypeId: roadMapTypes[initSettings.mapType]
        };


        getLatitudes(initSettings.startPlace, function (resultLatitudes) {

            // create map
            mapOptions.center = resultLatitudes;
            self.googleMap = new google.maps.Map(self.$sourceObject.get(0), mapOptions);
            
            // init default markers
            //for (var curMarker = 0; curMarker < pluginSettings.defaultMarkers.length; curMarker++) {
            //    pluginSettings.defaultMarkers[curMarker].map = map;
            //    addMarker(pluginSettings.defaultMarkers[curMarker], pluginSettings);
            //}

            var clickCallbackWithMapPrepared = function(event) {
                clickCallbackWithMap(event, self.googleMap);
            };
            google.maps.event.addListener(self.googleMap, 'click', clickCallbackWithMapPrepared);

        });

        return -1;
    };

    return self;
}

