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

                            res.render("pages/civils/casier_read.ejs", {
                                PARAMS: req.PARAMS,
                                I18N: req.I18N,
                                page_name: 'civils',
                                user: req.user,
                                datas: datas[0],
                                datasDetail: datasDetail
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


        /** ***********************************************
         *
         *********************************************** */
        app.get("/civils/casier_new/:civilid", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.player.grade);

            if (coplevel > 0) {

                const civilid = req.params.civilid;

                db.connect(true).then(conn => {

                    db.civils_get(conn, civilid).then(datas => {

                        db.code_penal(conn).then(datasCdePenal => {
                            res.render("pages/civils/casier_new.ejs", {
                                PARAMS: req.PARAMS,
                                I18N: req.I18N,
                                page_name: 'civils',
                                user: req.user,
                                datas: datas[0],
                                datasCdePenal: datasCdePenal
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


        /** ***********************************************
         *
         *********************************************** */
        app.get("/civils/edit/:civilid", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.player.grade);

            if (coplevel > 0) {

                const civilid = req.params.civilid;

                db.connect(true).then(conn => {

                    db.civils_get(conn, civilid).then(datas => {
                        console.log(">>>>>> ", datas);
                        res.render("pages/civils/edit.ejs", {
                            PARAMS: req.PARAMS,
                            I18N: req.I18N,
                            page_name: 'civils',
                            user: req.user,
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


        /** ***********************************************
         *
         *********************************************** */
        app.get("/civils/new", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.player.grade);

            if (coplevel > 0) {

                res.render("pages/civils/new.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'civils',
                    user: req.user
                });

            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         *
         *********************************************** */
        app.post("/civils/save", ensureAuthenticated, function (req, res) {

            const fs = require('fs');
            const steamid = req.params.steamid;
            const coplevel = parseInt(req.user.player.grade);

            let nom = req.body.nom;
            let prenom = req.body.prenom;
            let telephone = req.body.telephone;
            let genre = req.body.genre;
            let tail_cm = req.body.tail_cm;
            let profession = req.body.profession;
            let signe_distinctif = req.body.signe_distinctif;
            let photo_1 = req.body.photo_1;
            let photo_2 = req.body.photo_2;

            if (coplevel > 0) {

                db.connect(true).then(conn => {

                    SQL = `INSERT INTO civils(nom, prenom, telephone, genre, tail_cm, profession, signe_distinctif, photo_1, photo_2) VALUES ('${nom}', '${prenom}', '${telephone}', '${genre}', '${tail_cm}', '${profession}', '${signe_distinctif}', '${photo_1}', '${photo_2}');`
                    db.execute(conn, SQL).then(datas => {
                        res.redirect('/civils');
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
        app.post("/civils/save/:civilid", ensureAuthenticated, function (req, res) {

            const fs = require('fs');
            const steamid = req.params.steamid;
            const coplevel = parseInt(req.user.player.grade);
            const civilid = req.params.civilid;

            let nom = req.body.nom;
            let prenom = req.body.prenom;
            let telephone = req.body.telephone;
            let genre = req.body.genre;
            let tail_cm = req.body.tail_cm;
            let profession = req.body.profession;
            let signe_distinctif = req.body.signe_distinctif;
            let photo_1 = req.body.photo_1;
            let photo_2 = req.body.photo_2;

            if (coplevel > 0) {

                db.connect(true).then(conn => {

                    SQL = `UPDATE civils SET nom='${nom}', prenom='${prenom}', telephone='${telephone}', genre='${genre}', tail_cm='${tail_cm}', profession='${profession}', signe_distinctif='${signe_distinctif}', photo_1='${photo_1}', photo_2='${photo_2}' WHERE id=${civilid};`
                    db.execute(conn, SQL).then(datas => {
                        res.redirect('/civils');
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