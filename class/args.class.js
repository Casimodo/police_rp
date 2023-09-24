/*
    Author: tontonCasi [Twitch : https://www.twitch.tv/tontoncasi]
    Licence : MIT
    Source : https://github.com/Casimodo/police_rp
    Terms of use:
      This file comes from a source code covered by the MIT license please respect this. 
      All component files this code is filed, signed and certified with the competent international authority 
      in order to enforce copyright and ensure proof of an MIT license, thank you to respect that.
*/

module.exports = function() {

    var self = this;

    self.get = function() {
        var args = {
            port: 8080,
            env: 'debug'
        };
        var myArgs = process.argv.slice(2);
        myArgs.forEach(elem => {
            key = elem.split('=');
            let val = key[0].replace('--', '');
            args[val] = key[1];
        })
        return args;
    }

}