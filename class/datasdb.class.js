/*
    Author: tontonCasi [Twitch : https://www.twitch.tv/tontoncasi]
    Licence : MIT
    Source : https://github.com/Casimodo/police_rp
    Terms of use:
      This file comes from a source code covered by the MIT license please respect this. 
      All component files this code is filed, signed and certified with the competent international authority 
      in order to enforce copyright and ensure proof of an MIT license, thank you to respect that.
*/

/** ***********************************************************
 * datasdb.class.js
 ************************************************************ */
var mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const {
    Console
} = require('console');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * 
 * @param {*} logger 
 */
module.exports = function(logger) {

    var self = this;
    var colDateTimeName = 'DateTime';
    
    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.execute = function(conn, sql) {

        return new Promise((resolve, reject) => {
            try {
                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };

    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.get_table = function(conn, tableName, order, condition) {

        return new Promise((resolve, reject) => {
            try {
                let cond = ``;
                if (condition) cond = `WHERE ${condition}`;
                let sql = `SELECT * FROM ${tableName} ${cond} ORDER BY ${order} DESC;`;
                conn.query(sql, function(error, results, fields) {
                    if (error) {
                        reject(`db err ${error} >> SQL >> ${sql}`);
                    }
                    resolve(results);
                });

            } catch (err) {
                logger.error(`db err ${err} >> SQL >> ${sql}`);
                reject(`db err ${err}`);
            }
        });

    };


    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.user_infos = async function(uid) {

        // return new Promise((resolve, reject) => {
        //     try {
        //         /* let sql = `SELECT p.*, g.* FROM players AS p RIGHT JOIN grades AS g ON p.grade = g.key WHERE p.uid = "${uid}" LIMIT 1;`;

        //         conn.query(sql, function(error, results, fields) {
        //             if (error) reject(error.toString());
        //             resolve(results);
        //         }); */



        //     } catch (err) {
        //         reject(`db conn ${err}`);
        //     }
        // });

        return prisma.players.findUnique({ where: { uid }, include: { grades: true } });

    };


    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.code_penal = function(conn) {

        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT * FROM ref_amendes ORDER BY label;`;

                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };

    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.civils_get = function(conn, id) {

        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT * FROM civils WHERE id = "${id}" LIMIT 1;`;

                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };

    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.civils_list = function(conn) {

        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT civ.*, cas.* FROM civils AS civ LEFT JOIN casiers_judiciaire AS cas ON civ.id = cas.civil_id ORDER BY cas.id_casier DESC LIMIT 300;`;

                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };

    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.civils_casier = function(conn, id_casier) {

        return new Promise((resolve, reject) => {
            try {
                let casierId = parseInt(id_casier);
                let sql = `SELECT civ.*, cas.* FROM civils AS civ LEFT JOIN casiers_judiciaire AS cas ON civ.id = cas.civil_id WHERE cas.id_casier = ${casierId};`;

                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };

    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.civils_casier_detail = function(conn, id_casier) {

        return new Promise((resolve, reject) => {
            try {
                let casierId = parseInt(id_casier);
                let sql = `SELECT cas.*, ref.* FROM casiers_judiciaire_details AS cas LEFT JOIN ref_amendes AS ref ON cas.amende_id = ref.id_amende WHERE cas.casier_id = ${casierId} ORDER BY cas.id_cas_detail DESC;;`;

                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };

















    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.police_rapports_list = function(conn) {

        return new Promise((resolve, reject) => {
            try {
                //let sql = `SELECT * FROM intra_gn_rapports ${where} ORDER BY id DESC`;
                let sql = `SELECT rapport.id, player.playerid, player.name AS nameUser, rapport.civil_playerid AS civil_playerid, SUM(rapport.prix_amende) AS amendes FROM listallplayers AS player RIGHT JOIN intra_gn_rapports AS rapport ON player.playerid = rapport.civil_playerid GROUP BY rapport.civil_playerid ORDER BY rapport.id DESC;`;

                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };

    /** ******************************************************************************
     * 
     ****************************************************************************** */
    self.police_rapports = function(conn, steamid) {

        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT rap.date_create, rap.\`type\`, rap.sujet, rap.prix_amende, civil.name, agent.name AS agent_name FROM intra_gn_rapports AS rap LEFT JOIN listallplayers AS civil ON rap.civil_playerid = civil.playerid LEFT JOIN listallplayers AS agent ON rap.agent_playerid = agent.playerid WHERE rap.civil_playerid = '${steamid}' ORDER BY rap.id DESC;`;

                conn.query(sql, function(error, results, fields) {
                    if (error) reject(error.toString());
                    resolve(results);
                });

            } catch (err) {
                reject(`db conn ${err}`);
            }
        });

    };


    




}