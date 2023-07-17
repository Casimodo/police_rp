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
         *
         *********************************************** */
        app.get("/civils", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.player.grade);

            if (coplevel > 0) {

                db.connect(true).then(conn => {
                    db.civils_list(conn).then(datas => {
                        
                        res.render("pages/civils/index.ejs", {
                            PARAMS: req.PARAMS,
                            I18N: req.I18N,
                            page_name: 'civils',
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

        /** ***********************************************
         *
         *********************************************** */
        app.get("/civils/casier/:casierid", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.player.grade);

            if (coplevel > 0) {

                const casierid = req.params.casierid;

                db.connect(true).then(conn => {
                    db.civils_casier(conn, casierid).then(datas => {

                        db.civils_casier_detail(conn, casierid).then(datasDetail => {

                            console.log(datas);
                            res.render("pages/civils/casier_read.ejs", {
                                PARAMS: req.PARAMS,
                                I18N: req.I18N,
                                page_name: 'civils',
                                user: req.user,
                                datas: datas[0],
                                datasDetail: datasDetail,
                            });

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