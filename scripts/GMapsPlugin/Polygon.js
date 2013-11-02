function Polygon(dots, map) {

    var self = {};
    
    self.map = map;
    self.dots = dots;

    self.drawAroundPivot = function(pivot) {
        // Define the LatLng coordinates for the polygon's path.
        var triangleCoords = [];

        for (var i = 0; i < self.dots.length; i += 1) {

            var absoluteDotCoordinates = {
                x: self.dots[i].x + pivot.x,
                y: self.dots[i].y + pivot.y
            };

            triangleCoords.push(new google.maps.LatLng(absoluteDotCoordinates.x, absoluteDotCoordinates.y));
        }


        // Construct the polygon.
        polygon = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });

        polygon.setMap(map);
    };

}

