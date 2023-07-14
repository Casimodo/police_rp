/** ***********************************************************
 * datasdb.class.js
 ************************************************************ */
var mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const {
    Console
} = require('console');

/**
 * 
 * @param {*} config 
 * @param {*} logger 
 */
module.exports = function(config, logger) {

    var self = this;
    var colDateTimeName = 'DateTime';


    /** ******************************************************************************
     * Connect to db
     * 
     ****************************************************************************** */
    self.connect = function() {

        return new Promise((resolve, reject) => {
            try {

                //logger.info(`connexion mode with database name : ${config.mariadb.dbname} on ${config.mariadb.host}`);
                var conn = mysql.createConnection({
                    host: config.mariadb.host,
                    user: config.mariadb.user,
                    password: config.mariadb.password,
                    database: config.mariadb.dbname,
                    port: config.mariadb.port
                });

                conn.connect((err) => {
                    if (err) {
                        logger.error(`db conn ${err}`);
                        reject(`db conn ${err}`);
                    }
                    resolve(conn);
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
    self.user_infos = function(conn, uid) {

        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT p.*, g.* FROM players AS p RIGHT JOIN grades AS g ON p.grade = g.key WHERE p.uid = "${uid}" LIMIT 1;`;

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
     * Create table not existe
     * @param {*} tableName 
     * 
     ****************************************************************************** */
    self.createTableNotExist = function(tableName, format) {
        return new Promise((resolve, reject) => {
            try {

                var rowSqlArray = [];
                rowSqlArray.push(`\`${colDateTimeName}\` datetime DEFAULT NULL`); // toujours créer le champ datetime
                format.forEach((rowName) => {
                    switch (rowName) {
                        case 'MONTH':
                            rowSqlArray.push(`\`${rowName}\` varchar(3) DEFAULT NULL`);
                            break;
                        case 'DAY':
                            rowSqlArray.push(`\`${rowName}\` int(2) DEFAULT NULL`);
                            break;
                        case 'TIME':
                            rowSqlArray.push(`\`${rowName}\` time DEFAULT NULL`);
                            break;
                        default:
                            rowSqlArray.push(`\`${rowName}\` longtext DEFAULT NULL`);
                            break;
                    }

                });
                let rowSqlString = rowSqlArray.join(', ');

                self.connect(true).then(conn => {
                    var sqlDrop = `DROP TABLE \`${tableName}\`;`;
                    var sql = `CREATE TABLE \`${tableName}\` ( 
                        ${rowSqlString}
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf32;`;
                    conn.query(sqlDrop, function(error, results, fields) {
                        conn.query(sql, function(error, results, fields) {
                            if (error) reject(error.toString());
                            conn.end();
                            resolve(results);
                        });
                    });
                }).catch(err => {
                    reject(`db conn ${err}`);
                });
            } catch (err) {
                reject(`db purge ${err}`);
            }
        });
    }


    /** ******************************************************************************
     * Create database not existe
     * @param {*} datasBase 
     * 
     ****************************************************************************** */
    self.createDatabaseNotExist = function(datasBase) {
        return new Promise((resolve, reject) => {
            try {
                self.connect(false).then(conn => {
                    conn.query(`CREATE DATABASE IF NOT EXISTS \`${datasBase}\`;`, function(error, results, fields) {
                        if (error) reject(error.toString());
                        conn.end();
                        resolve(results);
                    });
                }).catch(err => {
                    reject(`db conn [createDatabaseNotExist] [${datasBase}] ${err}`);
                });
            } catch (err) {
                reject(`db purge [createDatabaseNotExist] [${datasBase}] ${err}`);
            }
        });
    }


    /** ******************************************************************************
     * Purge datatable with by name
     * @param {*} tableName 
     * 
     ****************************************************************************** */
    self.purge = function(tableName) {
        return new Promise((resolve, reject) => {
            try {
                self.connect(true).then(conn => {
                    conn.query('DELETE FROM `' + tableName + '`;', function(error, results, fields) {
                        if (error) reject(error.toString());
                        conn.end();
                        resolve(results);
                    });
                }).catch(err => {
                    reject(`db conn ${err}`);
                });
            } catch (err) {
                reject(`db purge ${err}`);
            }
        });
    }


    /** ******************************************************************************
     * Drop datatable with by name
     * @param {*} tableName 
     * 
     ****************************************************************************** */
    self.drop = function(tableName) {
        return new Promise((resolve, reject) => {
            try {
                self.connect(true).then(conn => {
                    var sqlDrop = `DROP TABLE \`${tableName}\`;`;
                    conn.query(sqlDrop, function(error, results, fields) {
                        if (error) reject(error.toString());
                        conn.end();
                        resolve(results);
                    });
                }).catch(err => {
                    reject(`db conn ${err}`);
                });
            } catch (err) {
                reject(`db drop ${err}`);
            }
        });
    }


    /** ******************************************************************************
     * Insert multi file into db with path filename
     * @param {*} pathInput 
     ****************************************************************************** */
    var _runloadDatasInfile = function(tableName, fileNameList, ot_response, conn, format, startDate, nbTotalFile, amqpConn, callback) {

        let obj_before = ot_response.get();

        try {

            // not more filename or not found
            if (fileNameList.length == 0) {
                conn.end();
                return callback(false, ot_response);
            }

            // fileNameList is not empty => keep last filename and work with this
            let fileName = fileNameList[fileNameList.length - 1];

            // work colomns in db
            var rowSqlDefA = [];
            var rowSqlAffectA = [];
            format.forEach((rowName) => {
                rowSqlDefA.push(`@${rowName}`);
                rowSqlAffectA.push(`${rowName}=@${rowName}`);
            });
            let rowSqlDef = rowSqlDefA.join(', ');
            let rowSqlAffect = rowSqlAffectA.join(', ');

            // prepare sql load
            logger.info(`PREPARE QUERY: LOAD DATA LOCAL INFILE "${fileName}"`);
            var StrDate = "STR_TO_DATE(CONCAT(@MONTH, '-', @DAY, '-', YEAR(NOW())),'%M-%d-%Y')";
            var query = `
                                    LOAD DATA LOCAL INFILE "${fileName}" INTO TABLE \`${tableName}\` 
                                        FIELDS TERMINATED BY ";"
                                        ENCLOSED BY "" 
                                        IGNORE 1 LINES
                                        (
                                            ${rowSqlDef}
                                        ) SET 
                                        ${colDateTimeName}=CONCAT(${StrDate}, ' ', @TIME),
                                        ${rowSqlAffect} 
                                        ;`;

            // execute sql
            conn.query(query, function(error, results, fields) {

                if (error) throw new Exception(error);

                // prepare amqp response
                var iFile = nbTotalFile - fileNameList.length;
                var pourcentAmqp = (20 / nbTotalFile) * iFile; // 20% of total barre
                var endDate = Date.now() * 1000;
                ot_response.insert({
                    OT: obj_before.OT,
                    progress: Math.ceil(pourcentAmqp + 30),
                    status: 206,
                    preprocess: {
                        python: obj_before.preprocess.python,
                        loadData: {
                            date_start: startDate,
                            date_end: endDate,
                            total_files: nbTotalFile,
                            file_now: iFile
                        }
                    }
                });

                // Publisher
                amqpConn.createChannel((err, ch) => {
                    if (err != null) {
                        console.error(`[preprocess] [datasdb:_runloadDatasInfile] AMQP conn error ${err.toString()}`);
                        callback(err, ot_response);
                    }
                    ch.assertQueue(config.amqp.queues.response);
                    let amqpMessage = JSON.stringify(ot_response.get());
                    ch.sendToQueue(config.amqp.queues.response, Buffer.from(amqpMessage));
                    logger.info(`AMQP send on chanel "${config.amqp.queues.response}" : ${JSON.stringify(amqpMessage)}`);

                    logger.info(`LOAD DATA LOCAL INFILE "${fileName}" INTO TABLE \`${tableName}\` `);

                    // remove filename used
                    fileNameList.pop();
                    logger.info(`queues remaining to be processed: ${JSON.stringify(fileNameList)}`);

                    // recursivity for working other filename
                    _runloadDatasInfile(tableName, fileNameList, ot_response, conn, format, startDate, nbTotalFile, amqpConn, callback);

                });


            });
        } catch (error) {
            ot_response.insert({
                OT: obj_before.OT,
                progress: 30,
                status: 500,
                code: 0,
                message: error.toString()
            });

            // Publisher
            amqpConn.createChannel((err, ch) => {
                if (err != null) {
                    console.error(`[preprocess] [datasdb:_runloadDatasInfile] AMQP conn error ${err.toString()}`);
                    callback(err, ot_response);
                }
                ch.assertQueue(config.amqp.queues.response);
                let amqpMessage = JSON.stringify(ot_response.get());
                ch.sendToQueue(config.amqp.queues.response, Buffer.from(amqpMessage));
                logger.info(`AMQP send on chanel "${config.amqp.queues.response}" : ${JSON.stringify(amqpMessage)}`);
                callback(error, ot_response);
            });
        }
    };


    /** ******************************************************************************
     * Insert multi file into db with path filename
     * @param {*} pathInput 
     ****************************************************************************** */
    self.loadDatasInfile = function(config, tableName, format, ot_response_class, amqpConn) {
        return new Promise((resolve, reject) => {
            try {
                pathLogs = config.path.workingPath;
                pathLogs = pathLogs.substring(0, pathLogs.length - 1); // remove last caracter for folder
                logger.info(`PATH scan get all log file is "${pathLogs}"`);

                // ========================= Import All file in folder =========================


                var nbTotalFile = 0;
                var startDate = Date.now() * 1000;
                var fileNameList = [];

                // file search working file
                fs.readdirSync(pathLogs).forEach(file => {
                    var fileName = path.join(pathLogs, file);

                    fileName = fileName.replace(/\\/g, "/"); // if windows path change for sql query    
                    fileNameList.push(fileName);
                });

                // load file in database
                nbTotalFile = fileNameList.length;
                self.connect(true).then(conn => {

                    // run load in data
                    _runloadDatasInfile(tableName, fileNameList, ot_response_class, conn, format, startDate, nbTotalFile, amqpConn, (err, ot_response) => {

                        // finish remove files
                        fileNameList.forEach((filenamePath) => {
                            fs.unlink(filenamePath, err => {
                                if (err)
                                    logger.error(`"${fileName}" file not found !`);
                            });
                        });


                        if (err) {
                            reject(`err in _runloadDatasInfile ${err}`);
                        } else {
                            resolve(ot_response);
                        }

                    });
                }).catch(err => {
                    reject(`db conn ${err}`);
                });

            } catch (err) {
                reject(`db load data infile ${err}`);
            }

        });
    }


    /** ******************************************************************************
     * ...
     * 
     ****************************************************************************** */
    processFields = function(conn, fileNameOutput, fields) {
        conn.pause(); // Pausing the connnection is useful if your processing involves I/O
        var fieldsName = [];
        for (const field in fields) {
            fieldsName.push(fields[field]['name']);
        }
        fs.appendFile(fileNameOutput, fieldsName.join(';') + '\r\n', function(err) {
            conn.resume();
        });
    }


    /** ******************************************************************************
     * ...
     * 
     ****************************************************************************** */
    var rowDatas = []; // TODO creer tableau cumulatif pour le fichier en stream
    writeRowIntoFile = function(fileNameOutput, conn) {

        var oneWrite = rowDatas.join('\r\n'); // Join line for one write
        rowDatas = [];
        conn.pause(); // Pausing the connnection is useful if your processing involves I/O
        fs.appendFileSync(fileNameOutput, oneWrite + '\r\n');
        conn.resume();
    }


    /** ******************************************************************************
     * ...
     * 
     ****************************************************************************** */
    processRow = function(conn, fileNameOutput, row, nbLine, ntf_system) {

        var values = [];
        let separator = ';';
        if (ntf_system) {
            separator = ' ';
        }
        for (let col in row) {
            let val = row[col];
            if (typeof(val) == "string") {
                val = val.replace(/\n|\r/g, ''); // remove all return line found
            }
            if ((ntf_system) && (col !== `${colDateTimeName}`)) {
                values.push(val);
            }
            if (!ntf_system) {
                values.push(val);
            }
        }
        rowDatas.push(values.join(separator)); // Join coloums
        if (nbLine % 10000 == 0) { // log amqp toutes les n lignes
            writeRowIntoFile(fileNameOutput, conn);
        }

    }


    /** ******************************************************************************
     * Get data in db for export to csv file
     * @param {*} config 
     * @param {*} msgAmqp
     * @param {*} ot_response_obj 
     * @param {*} openAmqp 
     * 
     ****************************************************************************** */
    self.exportedToCsv = function(config, msgAmqp, ot_response_obj, amqpConn) {

        let obj_before = ot_response_obj.get();

        return new Promise((resolve, reject) => {
            try {
                var ot_response = ot_response_obj;
                var startDate = Date.now() * 1000;

                let ntf_system = false;
                let file_ext = 'csv';
                if (msgAmqp.OBJ_PROFIL.ntf_system == "true") {
                    ntf_system = true;
                    file_ext = 'txt';
                }

                // ============= version direct export sql ==================
                self.connect(true).then(conn => {

                    // search total nb line and name file
                    let sqlQuery = `SELECT count(1) AS nbLineIndb, DATE_FORMAT(MIN(\`${colDateTimeName}\`), '%Y%m%d') AS dateNumber FROM \`${obj_before.OT}\` ORDER BY \`${colDateTimeName}\` ASC;`;
                    conn.query(sqlQuery, function(error, results, fields) {
                        logger.info(`results : "${results[0]}"`)

                        var nbTotalLine = results[0]['nbLineIndb'];
                        logger.info(`filename date : "${results[0]['dateNumber']}"`)
                        var filename = `${msgAmqp.OT}_concats-${results[0]['dateNumber']}.${file_ext}`;
                        var fileNameOutput = path.join(config.path.workingPath, filename);
                        var fileNameOutputEnd = path.join(config.path.mountPath, msgAmqp.OBJ_PATH.resultPath, filename);

                        if (fs.existsSync(fileNameOutput)) {
                            fs.unlinkSync(fileNameOutput);
                        }
                        logger.info(`Start export to "${fileNameOutput}"`);


                        var nbLine = 0;
                        var query = conn.query("SELECT `DateTime`, `MONTH`, `DAY`, `TIME`, `HOST`, `PROCESS`, `CONTENT` FROM `" + obj_before.OT + "` ORDER BY `DateTime` ASC;");

                        query
                            .on('error', function(err) {
                                // do something when an error happens
                                conn.end();
                                reject(`export ${err}`);
                            })
                            .on('fields', function(fields) {
                                if (!ntf_system) {
                                    processFields(conn, fileNameOutput, fields); // not header in file out
                                }
                            })
                            .on('result', function(row) {
                                nbLine++;
                                processRow(conn, fileNameOutput, row, nbLine, ntf_system);

                                if (nbLine % 10000 == 0) { // log amqp toutes les n lignes
                                    var pourAdvence = (30 / nbTotalLine) * nbLine; // 30% of total barre
                                    var endDate = Date.now() * 1000;
                                    ot_response.set({
                                        OT: obj_before.OT,
                                        progress: Math.ceil(pourAdvence + 50),
                                        status: 206,
                                        preprocess: {
                                            python: obj_before.preprocess.python,
                                            loadData: obj_before.preprocess.loadData,
                                            export: {
                                                date_start: startDate,
                                                date_end: endDate,
                                                filename: filename,
                                                nb_line_concat: nbLine
                                            }
                                        }
                                    });

                                    // Publisher
                                    amqpConn.createChannel((err, ch) => {
                                        if (err != null) console.error(`[preprocess] [datasdb:exportedToCsv] AMQP conn error ${JSON.stringify(err)}`);
                                        ch.assertQueue(config.amqp.queues.response);
                                        let amqpMessage = JSON.stringify(ot_response.get());
                                        ch.sendToQueue(config.amqp.queues.response, Buffer.from(amqpMessage));
                                        logger.info(`AMQP send on chanel "${config.amqp.queues.response}" : ${JSON.stringify(amqpMessage)}`);
                                    });

                                }

                            })
                            .on('end', function() {

                                writeRowIntoFile(fileNameOutput, conn);

                                // move the file to the final folder
                                fs.copyFile(fileNameOutput, fileNameOutputEnd, function(err) {
                                    if (err) reject(err);

                                    var endDate = Date.now() * 1000;
                                    ot_response.set({
                                        OT: obj_before.OT,
                                        progress: 100,
                                        status: 200,
                                        preprocess: {
                                            python: obj_before.preprocess.python,
                                            loadData: obj_before.preprocess.loadData,
                                            export: {
                                                date_start: startDate,
                                                date_end: endDate,
                                                filename: filename,
                                                nb_line_concat: nbLine
                                            }
                                        }
                                    });

                                    // Publisher
                                    amqpConn.createChannel((err, ch) => {
                                        if (err) reject(`[preprocess] [datasdb:exportedToCsv] AMQP conn error ${JSON.stringify(err)}`);
                                        ch.assertQueue(config.amqp.queues.response);
                                        let amqpMessage = JSON.stringify(ot_response.get());
                                        ch.sendToQueue(config.amqp.queues.response, Buffer.from(amqpMessage));
                                        logger.info(`AMQP send on chanel "${config.amqp.queues.response}" : ${JSON.stringify(amqpMessage)}`);

                                        logger.info(`export to "${fileNameOutput}" finish !`);
                                        fs.unlinkSync(fileNameOutput);
                                        resolve();
                                    });


                                });

                            });

                    });

                }).catch(err => {
                    reject(`db conn ${err}`);
                });


            } catch (err) {
                reject(`db export datas db to csv ${err}`);
            }

        });
    }
}