module.exports = function (config, app, logger, ensureAuthenticated, passport) {

    let self = this;
    const path = require('path');
    self.database = require('../class/datasdb.class.js');
    self.db = new self.database(config, logger);
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
        app.get("/", async function (req, res) {

            const coplevel = (req.user) ? parseInt(req.user.grade) : 0;
            var datas = [];
            if (coplevel >= 0) {
                datas = (await prisma.$queryRaw`SELECT players.*, grades.grade_label FROM players LEFT JOIN grades ON players.grade = grades.key WHERE players.service != "" AND players.actif = 1;`);
            }

            res.render("pages/index.ejs", {
                PARAMS: req.PARAMS,
                I18N: req.I18N,
                page_name: 'infos',
                user: req.user,
                datas
            });

        });


        /** ***********************************************
         * ERROR PAGES
         *********************************************** */
        app.get("/404", function (req, res) {
            res.render("pages/404.ejs", {
                PARAMS: req.PARAMS,
                I18N: req.I18N,
                page_name: 'infos',
                user: req.user
            });
        });

        app.get("/500", function (req, res) {
            res.render("pages/500.ejs", {
                PARAMS: req.PARAMS,
                I18N: req.I18N,
                page_name: 'infos',
                user: req.user
            });
        });

        app.get("/505", function (req, res) {
            res.render("pages/505.ejs", {
                PARAMS: req.PARAMS,
                I18N: req.I18N,
                page_name: 'infos',
                user: req.user
            });
        });

        app.get("/202", function (req, res) {
            res.render("pages/202.ejs", {
                PARAMS: req.PARAMS,
                I18N: req.I18N,
                page_name: 'infos',
                user: req.user
            });
        });


    } catch (err) {
        console.error("ERROR purge");
    }


}