/*
    Author: tontonCasi [Twitch : https://www.twitch.tv/tontoncasi]
    Licence : MIT
    Source : https://github.com/Casimodo/police_rp
    Terms of use:
      This file comes from a source code covered by the MIT license please respect this. 
      All component files this code is filed, signed and certified with the competent international authority 
      in order to enforce copyright and ensure proof of an MIT license, thank you to respect that.
*/

const { empty } = require('@prisma/client/runtime/library.js');

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
    /* const prisma = new PrismaClient({
        log: [
          {
            emit: 'stdout',
            level: 'query',
          },
          {
            emit: 'stdout',
            level: 'error',
          },
          {
            emit: 'stdout',
            level: 'info',
          },
          {
            emit: 'stdout',
            level: 'warn',
          },
        ],
      });

      prisma.$on('query', (e) => {
        console.log('Query: ' + e.query)
        console.log('Params: ' + e.params)
        console.log('Duration: ' + e.duration + 'ms')
      }); */

    try {

        /** ***********************************************
         * Liste des investigations référencés
         *********************************************** */
        app.get("/investigations", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);
                const investigation = parseInt(req.user.investigation);
                var stringSearch = [];

                if (coplevel >= 0 && investigation == 1) {

                    var whereCasier = [];
                    var whereCivil = [];
                    var whereRapport = [];
                    var whereInvest = [];
                    var datasCasier = [];
                    var datasCivil = [];
                    var datasRapport = [];
                    var datasInvest = [];
                    if (req.query.search) {
                        const words = req.query.search.split(' ');
                        stringSearch = req.query.search;

                        words.forEach((search) => {
                            whereCasier = whereCasier.concat(`cas.lieu LIKE "%${search}%" OR cas.detail_fait LIKE "%${search}%"`);
                            whereCivil = whereCivil.concat(`civ.nom LIKE '%${search}%' OR civ.prenom LIKE '%${search}%'`);
                            whereRapport = whereRapport.concat(`rap.sujet LIKE "%${search}%" OR rap.commentaire LIKE "%${search}%"`);
                            whereInvest = whereInvest.concat(`inv.sujet LIKE "%${search}%" OR inv.commentaire LIKE "%${search}%"`);
                        });

                        whereCasier = whereCasier.join(" OR ");
                        whereCivil = whereCivil.join(" OR ");
                        whereRapport = whereRapport.join(" OR ");
                        whereInvest = whereInvest.join(" OR ");

                        datasCasier = (await prisma.$queryRawUnsafe(`SELECT * FROM casiers_judiciaire AS cas WHERE ${whereCasier};`));
                        datasCivil = (await prisma.$queryRawUnsafe(`SELECT * FROM civils AS civ WHERE ${whereCivil};`));
                        datasRapport = (await prisma.$queryRawUnsafe(`SELECT * FROM rapports AS rap WHERE ${whereRapport};`));
                        datasInvest = (await prisma.$queryRawUnsafe(`SELECT * FROM investigations AS inv WHERE ${whereInvest};`));
                    };

                    const datas = (await prisma.$queryRaw`SELECT *, investigations.date AS dateCreate FROM investigations LEFT JOIN players ON investigations.agent_id = players.id WHERE investigations.status <> 'classé'`);

                    res.render("pages/investigations/index.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'investigations',
                        user: req.user,
                        datas: datas,
                        datasCasier: datasCasier,
                        datasCivil: datasCivil,
                        datasRapport: datasRapport,
                        datasInvest,
                        stringSearch
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
        app.get("/investigations/new", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel >= 0) {

                res.render("pages/investigations/new.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'investigations',
                    user: req.user
                });

            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet l'ajout d'un rapport (envoi des données)
         *********************************************** */
        app.post("/investigations/save", ensureAuthenticated, async function (req, res) {

            try {

                const coplevel = parseInt(req.user.grade);

                let type = req.body.type;
                let status = req.body.status;
                let sujet = req.body.sujet;
                let commentaire = req.body.commentaire;
                let photo_1 = req.body.photo_1;
                let photo_2 = req.body.photo_2;
                let photo_3 = req.body.photo_3;
                let photo_4 = req.body.photo_4;

                if (coplevel >= 0) {

                    const datas = (await prisma.$queryRaw`INSERT INTO investigations(agent_id, type, status, sujet, commentaire, photo_1, photo_2, photo_3, photo_4) VALUES (${req.user.id}, ${type}, ${status}, ${sujet}, ${commentaire}, ${photo_1}, ${photo_2}, ${photo_3}, ${photo_4});`);

                    res.redirect('/investigations');

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
        app.get("/investigations/edit/:rapportUuid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel >= 0) {

                    const uuid = req.params.rapportUuid;
                    const datas = (await prisma.$queryRaw`SELECT *, investigations.date AS dateCreate FROM investigations LEFT JOIN players ON investigations.agent_id = players.id WHERE investigations.uuid = ${uuid} LIMIT 1;`);

                    res.render("pages/investigations/edit.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'investigations',
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
        app.get("/investigations/read/:rapportUuid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel >= 0) {

                    const uuid = req.params.rapportUuid;
                    const datas = (await prisma.$queryRaw`SELECT *, investigations.date AS dateCreate FROM investigations LEFT JOIN players ON investigations.agent_id = players.id WHERE investigations.uuid = ${uuid} LIMIT 1;`);

                    res.render("pages/investigations/read.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'investigations',
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
        app.get("/investigations/read_extern/:rapportUuid", async function (req, res) {

            try {

                const uuid = req.params.rapportUuid;
                const datas = (await prisma.$queryRaw`SELECT *, investigations.date AS dateCreate FROM investigations LEFT JOIN players ON investigations.agent_id = players.id WHERE investigations.uuid = ${uuid} LIMIT 1;`);

                res.render("pages/investigations/read_extern.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'investigations',
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
        app.post("/investigations/save/:rapportUuid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);
                const uuid = req.params.rapportUuid;

                let type = req.body.type;
                let status = req.body.status;
                let sujet = req.body.sujet;
                let commentaire = req.body.commentaire;
                let photo_1 = req.body.photo_1;
                let photo_2 = req.body.photo_2;
                let photo_3 = req.body.photo_3;
                let photo_4 = req.body.photo_4;

                if (coplevel >= 0) {
                    const datas = (await prisma.$queryRaw`UPDATE investigations SET type=${type}, status=${status}, sujet=${sujet}, commentaire=${commentaire}, photo_1=${photo_1}, photo_2=${photo_2}, photo_3=${photo_3}, photo_4=${photo_4} WHERE uuid=${uuid};`);
                    res.redirect('/investigations');
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