function WifiMap() {
    var self = this;
    
    self.map = null;
    self.baseStations = [];
    self.clickCallback = null;
    
    self.initialize = function() {

        var haightAshbury = new google.maps.LatLng(37.7699298, -122.4469157);
        var mapOptions = {
            zoom: 12,
            center: haightAshbury,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        self.map = new google.maps.Map(document.getElementById("gmap-wifi"), mapOptions);

        google.maps.event.addListener(self.map, 'click', self.clickCallback);
    };

    self.addBaseStation = function (location, radius) {
       
        var baseStation = new BaseStation();
        
        baseStation.markup = $('.info-window').clone().show();
        baseStation.markup.find('.slider').slider({
            value: 100,
            min: 0,
            max: 500,
            step: 50,
            slide: function (event, ui) {
                console.log('map slide');
                baseStation.markup.find('.amount').val(ui.value);
                baseStation.area.setMap(null);
                baseStation.area = self.createArea(baseStation.area.center, +ui.value);
            }
        });
        
        baseStation.infoWindow = new google.maps.InfoWindow({
            content:baseStation.markup.get()[0]
        });
        
        baseStation.marker = new google.maps.Marker({
            position: location,
            map: self.map,
            icon: 'images/base_station_small.png'
        });
        
        google.maps.event.addListener(baseStation.marker, 'click', function () {
            
            baseStation.infoWindow.open(self.map, baseStation.marker);
            
        });
        baseStation.area = self.createArea(location, radius);

        self.baseStations.push(baseStation);
    };

    self.createArea = function(location, radius) {
        var options = {
            strokeColor: 'red',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: 'yellow',
            fillOpacity: 0.35,
            map: self.map,
            center: location,
            radius: radius
        };
        // Add the circle for this city to the map.
        return new google.maps.Circle(options);
    };
    // Removes the overlays from the map, but keeps them in the array

    self.clearOverlays = function() {
        if (baseStations) {
            for (i in baseStations) {
                baseStations[i].marker.setMap(null);
            }
        }
    };

    // Shows any overlays currently in the array

    self.showOverlays = function() {
        if (baseStations) {
            for (i in baseStations) {
                baseStations[i].marker.setMap(map);
            }
        }
    };

    // Deletes all markers in the array by removing references to them

    self.deleteOverlays = function() {
        if (baseStations) {
            for (i in baseStations) {
                baseStations[i].marker.setMap(null);
            }
            baseStations.length = 0;
        }
    };

};