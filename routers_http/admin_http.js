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
         * INDEX
         *********************************************** */
        app.get("/admin", ensureAuthenticated, async function (req, res) {

            const adminlevel = parseInt(req.user.admin);

            if (adminlevel > 0) {

                const datas = (await prisma.$queryRaw`SELECT players.*, grades.grade_label FROM players LEFT JOIN grades ON players.grade = grades.key;`);

                res.render("pages/admin/index.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'admin',
                    user: req.user,
                    datas
                });


            } else {
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         * INDEX
         *********************************************** */
        app.get("/admin/player/new", ensureAuthenticated, async function (req, res) {

            const adminlevel = parseInt(req.user.admin);

            if (adminlevel > 0) {

                const datasGrades = (await prisma.$queryRaw`SELECT * FROM grades;`);

                res.render("pages/admin/player_new.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'admin',
                    user: req.user,
                    datasGrades
                });


            } else {
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         * 
         *********************************************** */
        app.get("/admin/player/edit/:id", ensureAuthenticated, async function (req, res) {

            const adminlevel = parseInt(req.user.admin);
            const playerId = parseInt(req.params.id);

            if (adminlevel > 0) {

                const datas = (await prisma.$queryRaw`SELECT players.*, grades.grade_label FROM players LEFT JOIN grades ON players.grade = grades.key WHERE players.id=${playerId};`);
                const datasGrades = (await prisma.$queryRaw`SELECT * FROM grades;`);

                res.render("pages/admin/player_edit.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'admin',
                    user: req.user,
                    datas : datas[0],
                    datasGrades
                });


            } else {
                res.redirect('/logout');
            }

        });

        /** ***********************************************
         *
         *********************************************** */
        app.post("/admin/player/save/:id", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);
                const adminlevel = parseInt(req.user.admin);
                const id = req.params.id;

                let nom = req.body.nom;
                let prenom = req.body.prenom;
                let matricule = req.body.matricule;
                let grade = req.body.grade;
                let service = req.body.service;
                let investigation = (req.body.investigation) ? 1: 0;
                let actif = (req.body.actif) ? 1: 0;
                let adminP = (req.body.admin) ? 1: 0;

                if (adminlevel >= 0) {

                    const datas = (await prisma.$queryRaw`UPDATE players SET nom=${nom}, prenom=${prenom}, matricule=${matricule}, grade=${grade}, service=${service}, investigation=${investigation}, actif=${actif}, admin=${adminP} WHERE id=${id};`);
                    res.redirect('/admin');
                
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
        app.post("/admin/player/new", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);
                const adminlevel = parseInt(req.user.admin);
                const id = req.params.id;

                let username = req.body.username;
                let nom = req.body.nom;
                let prenom = req.body.prenom;
                let matricule = req.body.matricule;
                let grade = req.body.grade;
                let service = req.body.service;
                let investigation = (req.body.investigation) ? 1: 0;
                let actif = (req.body.actif) ? 1: 0;
                let adminP = (req.body.admin) ? 1: 0;
                let password = "be58019b6779dc2dfa54e9ae8773842a5311862f8f849a22c80ad2e4f20838ff99dbf73b1d7a403facae295a0137c586bbb16e25dd113bc9572d855a19208143";

                if (adminlevel >= 0) {

                    const datas = (await prisma.$queryRaw`INSERT INTO players(username, nom, prenom, matricule, grade, service, investigation, actif, admin, password) VALUE (${username}, ${nom}, ${prenom}, ${matricule}, ${grade}, ${service}, ${investigation}, ${actif}, ${adminP}, ${password});`);
                    res.redirect('/admin');
                
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