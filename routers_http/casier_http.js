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
         * Permet l'édition d'un casier de civil
         *********************************************** */
        app.get("/casier/edit/:civilid", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                const civilid = req.params.civilid;
                const datasCivil = (await prisma.$queryRaw`SELECT * FROM civils WHERE id = ${civilid} LIMIT 1;`);
                const datasCasiers = (await prisma.$queryRaw`SELECT cas.*, pla.*, SUM(tarif) AS total FROM casiers_judiciaire AS cas LEFT JOIN players AS pla ON cas.agent_id = pla.id LEFT JOIN casiers_judiciaire_details AS cas_det ON cas.id_casier = cas_det.casier_id LEFT JOIN ref_amendes AS amd ON cas_det.amende_id = amd.id   WHERE cas.civil_id = ${civilid} GROUP BY cas.id_casier;`);

                res.render("pages/casiers/edit.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'casiers',
                    user: req.user,
                    datas: datasCivil[0],
                    datasCasiers
                });


            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet la création d'un nouveau casier
         *********************************************** */
        app.get("/casier/detail/new/:civilid", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                const civilid = req.params.civilid;
                const agentid = req.user.id;
                console.log(">>>", req.user);

                const datasAdd = (await prisma.$queryRaw`INSERT INTO civils (civil_id, agent_id) VALUES (${civilid}, ${agentid});`);
                /* const new_casier_id = datasAdd
                const datasCasiers = (await prisma.$queryRaw`SELECT cas.*, pla.*, cas_det.*m amd.* FROM casiers_judiciaire AS cas LEFT JOIN players AS pla ON cas.agent_id = pla.id LEFT JOIN casiers_judiciaire_details AS cas_det ON cas.id_casier = cas_det.casier_id LEFT JOIN ref_amendes AS amd ON cas_det.amende_id = amd.id WHERE cas.id = ${new_casier_id};`);

                res.render("pages/casiers/edit.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'casiers',
                    user: req.user,
                    datas: datasCivil[0],
                    datasCasiers
                }); */


            } else {
                res.redirect('/logout');
            }
        });



    } catch (err) {
        console.error("ERROR purge");
    }


}