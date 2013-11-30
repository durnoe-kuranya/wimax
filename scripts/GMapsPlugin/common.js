var geocoder = geocoder || new google.maps.Geocoder();

function getLatitudes(placeName, completedCallback) {

    var resultLatitudes;
    console.log('Getting latitudes for ' + placeName);
    geocoder.geocode({ 'address': placeName }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            resultLatitudes = results[0].geometry.location;
            console.log(resultLatitudes);
        } else {
            throw new TypeError('Geocode was not successful for the following reason: ' + status);
        }

        completedCallback(resultLatitudes);
    });

    return -1;
}