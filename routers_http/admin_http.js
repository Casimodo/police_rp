module.exports = function (config, app, logger, ensureAuthenticated, passport) {

    let self = this;
    const path = require('path');
    const uid = require('uid');
    self.database = require('../class/datasdb.class.js');
    self.db = new self.database(config, logger);
    self.outilsClass = require('../class/utils.class.js');
    self.outils = new self.outilsClass();

    try {

        /** ***********************************************
         * INDEX
         *********************************************** */
        app.get("/admin", ensureAuthenticated, function (req, res) {
 
            const logArma3Folder = config.analyser.path;
            const fs = require('fs');

            const adminlevel = parseInt(req.user.player.adminlevel);

            if (adminlevel > 4) {

                db.connect(true).then(conn => {
                    db.admin_playerList(conn, null).then(datas => {

                        res.render("pages/admin/index.ejs", {
                            PARAMS: req.PARAMS,
                            I18N: req.I18N,
                            page_name: 'admin',
                            authent: req.user,
                            datas: datas
                        });

                        conn.end();

                    }, err => {
                        logger.error(err);
                    });
                }, err => {
                    logger.error(err);
                });

            } else {
                res.redirect('/logout');
            }

        }); 

        /** ***********************************************
         * 
         *********************************************** */
        app.get("/admin/player_details/:uuid", ensureAuthenticated, function (req, res) {

            const logArma3Folder = config.analyser.path;
            const fs = require('fs');
            const uuid = req.params.uuid;

            const coplevel = parseInt(req.user.player.coplevel);
            const adminlevel = parseInt(req.user.player.adminlevel);

            if (coplevel > 0 || adminlevel > 0) {

                db.connect(true).then(conn => {
                    db.admin_playerList(conn, uuid).then(datas => {

                        res.render("pages/admin/player_details.ejs", {
                            PARAMS: req.PARAMS,
                            I18N: req.I18N,
                            page_name: 'admin',
                            authent: req.user,
                            datas: datas[0]
                        });

                        conn.end();

                    }, err => {
                        logger.error(err);
                    });
                }, err => {
                    logger.error(err);
                });

            } else {
                res.redirect('/logout');
            }
        });



    } catch (err) {
        console.error("ERROR purge");
    }


}