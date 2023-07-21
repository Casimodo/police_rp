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
                const datasCasiers = (await prisma.$queryRaw`SELECT cas.*, pla.*, SUM(tarif * multiple) AS total FROM casiers_judiciaire AS cas LEFT JOIN players AS pla ON cas.agent_id = pla.id LEFT JOIN casiers_judiciaire_details AS cas_det ON cas.id_casier = cas_det.casier_id LEFT JOIN ref_amendes AS amd ON cas_det.amende_id = amd.id   WHERE cas.civil_id = ${civilid} GROUP BY cas.id_casier ORDER BY cas.id_casier DESC;`);

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

                const datasAdd = (await prisma.$queryRaw`INSERT INTO casiers_judiciaire (civil_id, agent_id) VALUES (${civilid}, ${agentid});`);
                const datasNewCasiers = (await prisma.$queryRaw`SELECT * FROM casiers_judiciaire WHERE detail_fait IS NULL ORDER BY id_casier DESC LIMIT 1;`);
                const datasCivil = (await prisma.$queryRaw`SELECT * FROM civils WHERE id = ${civilid} LIMIT 1;`);
                
                const detailsCasiers = (await prisma.$queryRaw`SELECT *, ref_amendes.id AS amende_id FROM casiers_judiciaire_details AS detail LEFT JOIN ref_amendes ON detail.amende_id = ref_amendes.id WHERE detail.casier_id = ${datasNewCasiers[0].id_casier} ORDER BY label;`);
                const datasCodePenal = (await prisma.$queryRaw`SELECT * FROM ref_amendes ORDER BY label;`);

                res.render("pages/casiers/detail.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'casiers',
                    user: req.user,
                    casier: datasNewCasiers[0],
                    civil: datasCivil[0],
                    detailsCasiers: detailsCasiers,
                    datasCdePenal: datasCodePenal
                });


            } else {
                res.redirect('/logout');
            }
        });

        /** ***********************************************
         * Permet d'éditer un casier
         *********************************************** */
        app.get("/casier/detail/edit/:casierid", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                const casierid = req.params.casierid;
                const agentid = req.user.id;

                const datasCasiers = (await prisma.$queryRaw`SELECT * FROM casiers_judiciaire WHERE casiers_judiciaire.id_casier = ${casierid} LIMIT 1;`);
                const datasCivil = (await prisma.$queryRaw`SELECT * FROM civils WHERE id = ${datasCasiers[0].civil_id} LIMIT 1;`);
                
                const detailsCasiers = (await prisma.$queryRaw`SELECT *, ref_amendes.id AS amende_id FROM casiers_judiciaire_details AS detail LEFT JOIN ref_amendes ON detail.amende_id = ref_amendes.id WHERE detail.casier_id = ${datasCasiers[0].id_casier} ORDER BY label;`);
                const datasCodePenal = (await prisma.$queryRaw`SELECT * FROM ref_amendes ORDER BY label;`);

                res.render("pages/casiers/detail.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'casiers',
                    user: req.user,
                    casier: datasCasiers[0],
                    civil: datasCivil[0],
                    detailsCasiers: detailsCasiers,
                    datasCdePenal: datasCodePenal
                });


            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet la sauvegarde d'un nouveau casier
         *********************************************** */
        app.post("/casier/detail/save/:casierid", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                const casierid = req.params.casierid;
                const agentid = req.user.id;
                let lieu = req.body.lieu;
                let detail_fait = req.body.detail_fait;

                const datasSave = (await prisma.$queryRaw`UPDATE casiers_judiciaire SET lieu=${lieu}, detail_fait=${detail_fait} WHERE id_casier=${casierid};`);

                res.redirect(`/casier/detail/edit/${casierid}`);

            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet l'ajout d'un détail de casier
         *********************************************** */
        app.get("/casier/detail/add/:casierid/:codePenalId", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                const casierid = req.params.casierid;
                const codePenalId = req.params.codePenalId;

                const datasAdd = (await prisma.$queryRaw`INSERT INTO casiers_judiciaire_details (casier_id, amende_id) VALUES (${casierid}, ${codePenalId});`);

                res.redirect(`/casier/detail/edit/${casierid}`);


            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet suppression d'un détail de casier
         *********************************************** */
        app.get("/casier/detail/remove/:casierid/:id_cas_detail", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                const casierid = req.params.casierid;
                const id_cas_detail = req.params.id_cas_detail;

                const datasAdd = (await prisma.$queryRaw`DELETE FROM casiers_judiciaire_details WHERE id_cas_detail = ${id_cas_detail};`);

                res.redirect(`/casier/detail/edit/${casierid}`);


            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet le multiple d'une ligne d'un détail de casier
         *********************************************** */
        app.get("/casier/detail/multiple/:casierid/:id_cas_detail/:value", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);

            if (coplevel > 0) {

                const casierid = req.params.casierid;
                const id_cas_detail = req.params.id_cas_detail;
                const value = req.params.value;

                const datasSave = (await prisma.$queryRaw`UPDATE casiers_judiciaire_details SET multiple=${value} WHERE id_cas_detail=${id_cas_detail};`);

                res.redirect(`/casier/detail/edit/${casierid}`);


            } else {
                res.redirect('/logout');
            }
        });




    } catch (err) {
        console.error("ERROR purge");
    }


}