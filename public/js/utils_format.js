/*
    Author: tontonCasi [Twitch : https://www.twitch.tv/tontoncasi]
    Licence : MIT
    Source : https://github.com/Casimodo/police_rp
    Terms of use:
      This file comes from a source code covered by the MIT license please respect this. 
      All component files this code is filed, signed and certified with the competent international authority 
      in order to enforce copyright and ensure proof of an MIT license, thank you to respect that.
*/

/** *******************************************
 * Filesize to string
 * @param {num in octect} size  
 ******************************************* */
var filesize = function(aSize) {
    aSize = Math.abs(parseInt(aSize, 10));
    var def = [
        [1, 'octets'],
        [1024, 'ko'],
        [1024 * 1024, 'Mo'],
        [1024 * 1024 * 1024, 'Go'],
        [1024 * 1024 * 1024 * 1024, 'To']
    ];
    for (var i = 0; i < def.length; i++) {
        if (aSize < def[i][0]) return (aSize / def[i - 1][0]).toFixed(2) + ' ' + def[i - 1][1];
    }
}

/** *******************************************
 *  timestamp to local string format
 * @param {timestamp (unix * 1000) for miliem format} not_unix_timestamp 
 ******************************************** */
var dateFormat = function(not_unix_timestamp) {

    var date = new Date(not_unix_timestamp);
    var stringDateFormat = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return stringDateFormat;
}