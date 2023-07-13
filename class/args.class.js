/**
 * 
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