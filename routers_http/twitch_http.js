/*
    Author: tontonCasi [Twitch : https://www.twitch.tv/tontoncasi]
    Licence : MIT
    Source : https://github.com/Casimodo/police_rp
    Terms of use:
      This file comes from a source code covered by the MIT license please respect this. 
      All component files this code is filed, signed and certified with the competent international authority 
      in order to enforce copyright and ensure proof of an MIT license, thank you to respect that.
*/

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

                const datasTop3Casier = (await prisma.$queryRaw`SELECT cjd.casier_id, civ.prenom, civ.nom, SUM(ra.tarif * cjd.multiple) AS total FROM casiers_judiciaire_details AS cjd 
                LEFT JOIN ref_amendes AS ra ON (cjd.amende_id = ra.id)
                LEFT JOIN casiers_judiciaire AS ca ON (cjd.casier_id = ca.id_casier)
                LEFT JOIN civils AS civ ON (ca.civil_id = civ.id)
                GROUP BY cjd.casier_id ORDER BY SUM(ra.tarif * cjd.multiple) DESC
                LIMIT 3`);

                const datasTop3dernierCasier = (await prisma.$queryRaw`SELECT MAX(cj.date) AS ddate, civ.id, civ.prenom, civ.nom, SUM(ra.tarif * cjd.multiple) AS total FROM casiers_judiciaire AS cj
                LEFT JOIN casiers_judiciaire_details AS cjd ON (cj.id_casier = cjd.casier_id)
                LEFT JOIN ref_amendes AS ra ON (cjd.amende_id = ra.id)
                LEFT JOIN civils AS civ ON (cj.civil_id = civ.id)
                GROUP BY civ.id 
                ORDER BY ddate DESC
                LIMIT 10;`);

                res.render("pages/twitch/casier.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: '',
                    user: req.user,
                    datasTop3Casier,
                    datasTop3dernierCasier
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