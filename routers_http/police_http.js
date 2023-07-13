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
        app.get("/archives", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.player.grade);

            if (coplevel > 0) {

                res.render("pages/archives/index.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'archives',
                    user: req.user
                });

            } else {
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         * 
         *********************************************** */
        app.get("/police/rapports", ensureAuthenticated, function (req, res) {

            const logArma3Folder = config.analyser.path;
            const fs = require('fs');

            const coplevel = parseInt(req.user.player.coplevel);
            const adminlevel = parseInt(req.user.player.adminlevel);

            if (coplevel > 0 || adminlevel > 0) {

                db.connect(true).then(conn => {
                    db.police_rapports_list(conn).then(datas => {

                        res.render("pages/police/rapports.ejs", {
                            PARAMS: req.PARAMS,
                            I18N: req.I18N,
                            page_name: 'rapports',
                            user: req.user,
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


        app.get("/police/rapports/:steamid", ensureAuthenticated, function (req, res) {

            const logArma3Folder = config.analyser.path;
            const fs = require('fs');
            const steamid = req.params.steamid;

            const coplevel = parseInt(req.user.player.coplevel);
            const adminlevel = parseInt(req.user.player.adminlevel);

            if (coplevel > 0 || adminlevel > 0) {

                db.connect(true).then(conn => {
                    db.police_rapports(conn, steamid).then(datas => {

                        console.log(datas);
                        res.render("pages/police/rapports_read.ejs", {
                            PARAMS: req.PARAMS,
                            I18N: req.I18N,
                            page_name: 'rapports_read',
                            user: req.user,
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

        app.get("/police/casiers", ensureAuthenticated, function (req, res) {

            const logArma3Folder = config.analyser.path;
            const fs = require('fs');
            const steamid = req.params.steamid;

            const coplevel = parseInt(req.user.player.coplevel);
            const adminlevel = parseInt(req.user.player.adminlevel);

            if (coplevel > 0 || adminlevel > 0) {

                db.connect(true).then(conn => {
                    db.get_table(conn, 'listallplayers', 'name', false).then(datas => {

                        res.render("pages/police/rapports_edit.ejs", {
                            PARAMS: req.PARAMS,
                            I18N: req.I18N,
                            page_name: 'rapports_edit',
                            user: req.user,
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

        app.post("/police/rapport_save", ensureAuthenticated, function (req, res) {

            const logArma3Folder = config.analyser.path;
            const fs = require('fs');
            const steamid = req.params.steamid;

            const coplevel = parseInt(req.user.player.coplevel);
            const adminlevel = parseInt(req.user.player.adminlevel);
            let type = req.body.type;
            let agent_name = req.body.agent_name;
            let agent_playerid = req.body.agent_playerid;
            let civil_name = req.body.civil_name;
            let sujet = req.body.sujet;
            let amende = req.body.amende;

            if (coplevel > 0 || adminlevel > 0) {

                db.connect(true).then(conn => {
                    SQL = `SELECT playerid FROM listallplayers WHERE name = "${civil_name}";`
                    db.execute(conn, SQL).then(datas => {

                        let civil_playerid = datas[0].playerid;

                        SQL = `INSERT INTO intra_gn_rapports(agent_playerid, type, civil_playerid, sujet, prix_amende) VALUES ('${agent_playerid}', '${type}', '${civil_playerid}', '${sujet}', '${amende}');`
                        db.execute(conn, SQL).then(datas => {
                            res.redirect('/police');
                            conn.end();
                        }, err => {
                            logger.error(err);
                        });

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