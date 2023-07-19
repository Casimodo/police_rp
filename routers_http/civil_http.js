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
         * Liste des civils référencés
         *********************************************** */
        app.get("/civils", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel > 0) {

                    const datas = (await prisma.$queryRaw`SELECT civ.* FROM civils AS civ ORDER BY civ.id DESC LIMIT 300;`);

                    res.render("pages/civils/index.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'civils',
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
         * Permet l'ajout d'un civil (feuille edition)
         *********************************************** */
        app.get("/civils/new", ensureAuthenticated, function (req, res) {

            const coplevel = parseInt(req.user.grade);

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
         * Permet l'ajout d'un civil (envoi des données)
         *********************************************** */
        app.post("/civils/save", ensureAuthenticated, async function (req, res) {

            try {

                const coplevel = parseInt(req.user.grade);

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

                    const datas = (await prisma.$queryRaw`INSERT INTO civils(nom, prenom, telephone, genre, tail_cm, profession, signe_distinctif, photo_1, photo_2) VALUES (${nom}, ${prenom}, ${telephone}, ${genre}, ${tail_cm}, ${profession}, ${signe_distinctif}, ${photo_1}, ${photo_2});`);

                    res.redirect('/civils');

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
        app.get("/civils/edit/:civilid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel > 0) {

                    const civilid = req.params.civilid;
                    const datas = (await prisma.$queryRaw`SELECT * FROM civils WHERE id = ${civilid} LIMIT 1;`);

                    res.render("pages/civils/edit.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'civils',
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
        app.post("/civils/save/:civilid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);
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
                    const datas = (await prisma.$queryRaw`UPDATE civils SET nom=${nom}, prenom=${prenom}, telephone=${telephone}, genre=${genre}, tail_cm=${tail_cm}, profession=${profession}, signe_distinctif=${signe_distinctif}, photo_1=${photo_1}, photo_2=${photo_2} WHERE id=${civilid};`);
                    res.redirect('/civils');
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