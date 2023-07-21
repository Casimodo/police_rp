module.exports = function (config, app, logger, ensureAuthenticated, passport) {

    let self = this;
    const path = require('path');
    const uid = require('uid');
    self.outilsClass = require('../class/utils.class.js');
    self.outils = new self.outilsClass();

    const {
        PrismaClient
    } = require('@prisma/client');

    const prisma = new PrismaClient();

    try {

        /** ***********************************************
         * Liste des rapports référencés
         *********************************************** */
        app.get("/rapports", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel > 0) {

                    const datas = (await prisma.$queryRaw`SELECT *, rapports.date AS dateCreate FROM rapports LEFT JOIN players ON rapports.agent_id = players.id`);

                    res.render("pages/rapports/index.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'rapports',
                        user: req.user,
                        datas: datas
                    });

                } else {
                    res.redirect('/logout');
                }
            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         * Permet l'ajout d'un rapport (feuille edition)
         *********************************************** */
        app.get("/rapports/new", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                res.render("pages/rapports/new.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'rapports',
                    user: req.user
                });

            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet l'ajout d'un rapport (envoi des données)
         *********************************************** */
        app.post("/rapports/save", ensureAuthenticated, async function (req, res) {

            try {

                const coplevel = parseInt(req.user.grade);

                let sujet = req.body.sujet;
                let commentaire = req.body.commentaire;

                if (coplevel > 0) {

                    const datas = (await prisma.$queryRaw`INSERT INTO rapports(agent_id, sujet, commentaire) VALUES (${req.user.id}, ${sujet}, ${commentaire});`);

                    res.redirect('/rapports');

                } else {
                    res.redirect('/logout');
                }

            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         *
         *********************************************** */
        app.get("/rapports/edit/:rapportUuid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel > 0) {

                    const uuid = req.params.rapportUuid;
                    const datas = (await prisma.$queryRaw`SELECT *, rapports.date AS dateCreate FROM rapports LEFT JOIN players ON rapports.agent_id = players.id WHERE rapports.uuid = ${uuid} LIMIT 1;`);

                    res.render("pages/rapports/edit.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'rapports',
                        user: req.user,
                        datas: datas[0]
                    });

                } else {
                    res.redirect('/logout');
                }
            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         *
         *********************************************** */
        app.get("/rapports/read/:rapportUuid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel > 0) {

                    const uuid = req.params.rapportUuid;
                    const datas = (await prisma.$queryRaw`SELECT *, rapports.date AS dateCreate FROM rapports LEFT JOIN players ON rapports.agent_id = players.id WHERE rapports.uuid = ${uuid} LIMIT 1;`);

                    res.render("pages/rapports/read.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'rapports',
                        user: req.user,
                        datas: datas[0]
                    });

                } else {
                    res.redirect('/logout');
                }
            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         *
         *********************************************** */
        app.get("/rapports/read_extern/:rapportUuid", async function (req, res) {

            try {

                const uuid = req.params.rapportUuid;
                const datas = (await prisma.$queryRaw`SELECT *, rapports.date AS dateCreate FROM rapports LEFT JOIN players ON rapports.agent_id = players.id WHERE rapports.uuid = ${uuid} LIMIT 1;`);

                res.render("pages/rapports/read_extern.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'rapports',
                    user: req.user,
                    datas: datas[0]
                });

            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         *
         *********************************************** */
        app.post("/rapports/save/:rapportUuid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);
                const uuid = req.params.rapportUuid;

                let sujet = req.body.sujet;
                let commentaire = req.body.commentaire;

                if (coplevel > 0) {
                    const datas = (await prisma.$queryRaw`UPDATE rapports SET sujet=${sujet}, commentaire=${commentaire} WHERE uuid=${uuid};`);
                    res.redirect('/rapports');
                } else {
                    res.redirect('/logout');
                }
            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });



    } catch (err) {
        console.error("ERROR purge");
    }


}