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
         *
         *********************************************** */
        app.get("/twitch/casier", async function (req, res) {

            try {

                const datas = (await prisma.$queryRaw`SELECT MAX(cas.date) AS dateCas, civ.*, SUM(tarif * multiple) AS total FROM civils AS civ 
                    LEFT JOIN casiers_judiciaire AS cas ON civ.id = cas.civil_id 
                    LEFT JOIN casiers_judiciaire_details AS cas_det ON cas.id_casier = cas_det.casier_id
                    LEFT JOIN ref_amendes AS amd ON cas_det.amende_id = amd.id
                    GROUP BY civ.id ORDER BY MAX(cas.date) DESC LIMIT 5`);

                res.render("pages/twitch/casier.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: '',
                    user: req.user,
                    datas: datas
                });


            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });


    } catch (err) {
        console.error("ERROR purge");
    }


}