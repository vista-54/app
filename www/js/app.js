var regions =
        [
            // Sample UUIDs for beacons in our lab.
             {uuid: 'F7826DA6-4FA2-4E98-8024-BC5B71E0893E'},
        ];

// Dictionary of beacons.
var beacons = {};



// Timer that displays list of beacons.
var updateTimer = null;

var isMobile = false;
if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
    isMobile = true;
}
function initapp() {
    if (isMobile) {
        window.locationManager = cordova.plugins.locationManager;
        // Start tracking beacons!
        startScan();
    } 

    // Display refresh timer.
    updateTimer = setInterval(displayBeaconList, 500);

   // initIndoorMap();

}

function startScan() {
    var delegate = new locationManager.Delegate();
    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        var maxRSSI = -100;

        for (var i in pluginResult.beacons) {
            var beacon = pluginResult.beacons[i];
            beacon.timeStamp = Date.now();
            var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
            beacons[key] = beacon;

        }


     


    };
    delegate.didStartMonitoringForRegion = function (pluginResult) {
        //console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
    };

    // Called when monitoring and the state of a region changes.
    // (Not used in this example, included as a reference.)
    delegate.didDetermineStateForRegion = function (pluginResult) {
        //console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
    };

    // Set the delegate object to use.
    locationManager.setDelegate(delegate);

    // Request permission from user to access location info.
    // This is needed on iOS 8.
    locationManager.requestAlwaysAuthorization();

    // Start monitoring and ranging beacons.
    for (var i in regions) {

        var beaconRegion = new locationManager.BeaconRegion(
                i + 1,
                regions[i].uuid);

        // Start ranging.
        locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail(console.error)
                .done();

    }


}


function displayBeaconList() {
    // Clear beacon list.
    $('#found-beacons').empty();
    $('#info').empty();
    var timeNow = Date.now();
    $.each(beacons, function (key, beacon) {
        if (beacon.timeStamp + 60000 > timeNow) {
            var rssiWidth = 1; // Used when RSSI is zero or greater.
            if (beacon.rssi < -100) {
                rssiWidth = 100;
            }
            else if (beacon.rssi < 0) {
                rssiWidth = 100 + beacon.rssi;
            }
            var element = $(
                    '<li>'
                    + beacon.uuid + '<br />'
                    + 'Mj: ' + beacon.major + ' &nbsp;<br /> '
                    + 'Mn: ' + beacon.minor + ' &nbsp;<br /> '
                    + 'Prox: ' + beacon.proximity + '<br />'
                    + 'Accuracy: ' + beacon.accuracy + '<br />'
                    + 'RSSI: ' + beacon.rssi + ' &nbsp; &nbsp;<br /> '
                    //+ '<div style="background:rgb(255,128,64);height:20px;width:'
                    //+ rssiWidth + '%;"></div>'
                    + '</li>'
                    );
            searchBeacon(beacon.uuid,beacon.minor,beacon.major);
            $('#warning').remove();
            $('#found-beacons').append(element);
        }

    });
}