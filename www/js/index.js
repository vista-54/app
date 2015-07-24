function StartScanBeacons() {
    initapp();
}
function searchBeacon($uuid, $minor, $major) {
    $('#msg').empty();
    var ui="536d61-7274204-3697479-204e74-776b73";
//    var ui = "f7826da6-4fa2-4e98-8024-bc5b71e0893e";
    var mn = "15";
//var mn="37051";
    var mj = "99";
//var mj="46650";
    if (($uuid === ui) && ($minor === mn) && ($major === mj))
    {
        $('#msg').append("Here i found it!");
    }
}