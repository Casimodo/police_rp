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
        app.get("/cdepenal", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel >= 0) {

                const datas = (await prisma.$queryRaw`SELECT * FROM ref_amendes WHERE ancien_code = 0 ORDER BY label;`);

                res.render("pages/code_penal/index.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'cdepenal',
                    user: req.user,
                    datasCdePenal: datas
                });

            } else {
                res.redirect('/logout');
            }

        });



    } catch (err) {
        console.error("ERROR purge");
    }


}