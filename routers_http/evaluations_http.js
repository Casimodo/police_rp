const { empty } = require('@prisma/client/runtime/library.js');
const { data } = require('jquery');

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
         * Permet l'ajout (feuille edition)
         *********************************************** */
        app.get("/evaluations/new/:agent_id", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);
            const agent_id = req.params.agent_id;
            const evaluateur = parseInt(req.user.evaluateur);

            if ((coplevel >= 0) && (evaluateur == 1)) {

                const datas = (await prisma.$queryRaw`SELECT players.*, grades.grade_label FROM players LEFT JOIN grades ON (players.grade = grades.key) WHERE players.id = ${agent_id};`);

                res.render("pages/evaluations/new.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'evaluations',
                    user: req.user,
                    datas: datas[0]
                });

            } else {
                res.redirect('/logout');
            }
        });

        /** ***********************************************
         * Permet export
         *********************************************** */
        app.get("/evaluations/export", ensureAuthenticated, async function (req, res) {

            const adminlevel = parseInt(req.user.admin);

            if (adminlevel > 0) {

                const datas = (await prisma.$queryRaw`SELECT DATE_FORMAT(date, "%d/%m/%Y %T") AS date, agent_name, agent_grade, service, examinateur_name, examinateur_grade, call_radio, conduite, respect_patrouille, respect_civil, control_routier, procedure_arrestation, REPLACE(REPLACE(commentaire,';',''), ';', '') as commentaire FROM evaluation_compétences ORDER BY date DESC;`);

                let csv_data = '"date";"agent";"agent grade";"service";"examinateur";"examinateur grade";"call radio";"conduite";"respect patrouille";"respect civil";"control routier";"procedure arrestation";"commentaire"\n';

                datas.forEach((dt) => {
                    csv_data += '"' + Object.values(dt).join('";"') + '"\n';
                });

                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", "attachment; filename=evaluation.csv");
                res.status(200).end(csv_data.toString('utf-8'), 'utf-8');

            } else {
                res.redirect('/logout');
            }
        });


        /** ***********************************************
         * Permet (envoi des données)
         *********************************************** */
        app.post("/evaluations/save", ensureAuthenticated, async function (req, res) {

            try {

                const coplevel = parseInt(req.user.grade);
                const evaluateur = parseInt(req.user.evaluateur);

                let agent_id = req.body.agent_id;
                let agent_name = req.body.agent_name;
                let agent_grade = req.body.agent_grade;
                let service = req.body.service;
                let examinateur_id = req.body.examinateur_id;
                let examinateur_name = req.body.examinateur_name;
                let examinateur_grade = req.body.examinateur_grade;
                let commentaire = req.body.commentaire;
                let call_radio = req.body.call_radio;
                let conduite = req.body.conduite;
                let respect_civil = req.body.respect_civil;
                let respect_patrouille = req.body.respect_patrouille;
                let control_routier = req.body.control_routier;
                let procedure_arrestation = req.body.procedure_arrestation;

                if ((coplevel >= 0) && (evaluateur == 1)) {

                    const datas = (await prisma.$queryRaw`
                        INSERT INTO evaluation_compétences (agent_id, agent_name, agent_grade, service, examinateur_id, examinateur_name, examinateur_grade, commentaire, call_radio, conduite, respect_patrouille, respect_civil, control_routier, procedure_arrestation) 
                        VALUES (${agent_id}, ${agent_name}, ${agent_grade}, ${service}, ${examinateur_id}, ${examinateur_name}, ${examinateur_grade}, ${commentaire}, ${call_radio}, ${conduite}, ${respect_patrouille}, ${respect_civil}, ${control_routier}, ${procedure_arrestation});`);

                    res.redirect('/');

                } else {
                    res.redirect('/logout');
                }

            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });


        /** ***********************************************
         * calcul
         *********************************************** */
        app.get("/evaluations", ensureAuthenticated, async function (req, res) {

            const coplevel = parseInt(req.user.grade);
            const evaluateur = parseInt(req.user.evaluateur);

            if ((coplevel >= 0) && (evaluateur == 1)) {

                const datas = (await prisma.$queryRaw`
                SELECT agent_name, agent_grade, service, nbEval,
                    ROUND(SumCallRadio / NbCallRadio) AS CallRadio, 
                    ROUND(SumConduite / NbConduite) AS Conduite, 
                    ROUND(SumRespPat / NbRespPat) AS RespPat, 
                    ROUND(SumRespCiv / NbRespCiv) AS RespCiv, 
                    ROUND(SumContRoutier / NbContRoutier) AS ContRoutier,
                    ROUND(SumProcArr / NbProcArr) AS ProcArr
                FROM calcul_eva_competences
                `);

                res.render("pages/evaluations/index.ejs", {
                    PARAMS: req.PARAMS,
                    I18N: req.I18N,
                    page_name: 'evaluations',
                    user: req.user,
                    datas: datas
                });

            } else {
                res.redirect('/logout');
            }
        });


    } catch (err) {
        console.error("ERROR purge");
    }


}