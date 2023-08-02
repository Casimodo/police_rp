module.exports = function (config, app, logger, ensureAuthenticated, passport) {

    let self = this;
    const path = require('path');
    self.outilsClass = require('../class/utils.class.js');
    self.outils = new self.outilsClass();
    const crypto = require('crypto');

    const {
        PrismaClient
    } = require('@prisma/client');

    const prisma = new PrismaClient();


    try {

        /** ***********************************************
         * 
         *********************************************** */
        app.get("/players/edit/:id", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);

                if (coplevel >= 0) {

                    const id = req.params.id;
                    const datas = (await prisma.$queryRaw`SELECT * FROM players WHERE id = ${id} LIMIT 1;`);

                    res.render("pages/players/edit.ejs", {
                        PARAMS: req.PARAMS,
                        I18N: req.I18N,
                        page_name: 'infos',
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
        app.post("/players/save/:civilid", ensureAuthenticated, async function (req, res) {

            try {
                const coplevel = parseInt(req.user.grade);
                const admin = parseInt(req.user.admin);
                const civilid = req.params.civilid;

                let nom = req.body.nom;
                let prenom = req.body.prenom;
                let matricule = req.body.matricule;
                let telephone = req.body.telephone;
                let password = req.body.password;

                if (coplevel >= 0) {

                    if (password != "") {
                        var nPass = 'be58019b6779dc2dfa54e9ae8773842a5311862f8f849a22c80ad2e4f20838ff99dbf73b1d7a403facae295a0137c586bbb16e25dd113bc9572d855a19208143';
                        crypto.scrypt(password, process.env.WEB_SERVER_TOKEN, 64, async (err, derivedKey) => {
                            if (err) {
                                console.error(err);
                            };
                            nPass = derivedKey.toString('hex');
                            const datas = (await prisma.$queryRaw`UPDATE players SET nom=${nom}, prenom=${prenom}, matricule=${matricule}, telephone=${telephone}, password=${nPass} WHERE id=${civilid};`);
                        });
                    } else {
                        const datas = (await prisma.$queryRaw`UPDATE players SET nom=${nom}, prenom=${prenom}, matricule=${matricule}, telephone=${telephone} WHERE id=${civilid};`);
                    }
                    res.redirect('/');

                } else {
                    res.redirect('/logout');
                }
            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });



    } catch (err) {
        console.error("ERROR ...");
    }


}