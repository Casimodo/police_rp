module.exports = function (config, app, logger, ensureAuthenticated, passport) {

    let self = this;
    const path = require('path');
    self.database = require('../class/datasdb.class.js');
    self.db = new self.database(config, logger);
    self.outilsClass = require('../class/utils.class.js');
    self.outils = new self.outilsClass();


    try {

        /* ************************************ **/
        app.get("/account", ensureAuthenticated, function (req, res) {
            res.render('pages/steam/account', {
                PARAMS: req.PARAMS,
                I18N: req.I18N,
                user: req.user
            });
        });

        /* ************************************ **/
        app.get('/logout', function (req, res, next) {
            req.logout(function (err) {
                if (err) { return next(err); }
                res.redirect('/');
            });
        });

        /* ************************************ **/
        // GET /auth/steam
        //   Use passport.authenticate() as route middleware to authenticate the
        //   request.  The first step in Steam authentication will involve redirecting
        //   the user to steamcommunity.com.  After authenticating, Steam will redirect the
        //   user back to this application at /auth/steam/return
        app.get('/auth/steam',
            passport.authenticate('steam', { failureRedirect: '/' }),
            function (req, res) {
                res.redirect('/');
            });

        /* ************************************ **/
        // GET /auth/steam/return
        //   Use passport.authenticate() as route middleware to authenticate the
        //   request.  If authentication fails, the user will be redirected back to the
        //   login page.  Otherwise, the primary route function function will be called,
        //   which, in this example, will redirect the user to the home page.
        app.get('/auth/steam/return',
            passport.authenticate('steam', { failureRedirect: '/' }),
            function (req, res) {
                res.redirect('/');
            });

    } catch (err) {
        console.error("ERROR steam account", err);
    }


}