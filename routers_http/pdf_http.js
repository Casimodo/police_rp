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
    const PDFDocument = require('pdfkit');
    const fs = require('fs');

    const {
        PrismaClient
    } = require('@prisma/client');

    const prisma = new PrismaClient();

    try {

        /** ***********************************************
         * 
         *********************************************** */
        app.get("/pdf", async function (req, res) {

            try {

                // Create a document
                const doc = new PDFDocument();

                // Pipe its output somewhere, like to a file or HTTP response
                // See below for browser usage
                doc.pipe(fs.createWriteStream('output.pdf'));

                // Embed a font, set the font size, and render some text
                doc
                    .fontSize(25)
                    .text('Some text with an embedded font!', 100, 100);

                // Add an image, constrain it to a given size, and center it vertically and horizontally
                /*doc.image('https://cdn.discordapp.com/attachments/1131619904328577127/1131656706057838672/image.png', {
                    fit: [250, 300],
                    align: 'center',
                    valign: 'center'
                });*/

                // Add another page
                doc
                    .addPage()
                    .fontSize(25)
                    .text('Here is some vector graphics...', 100, 100);

                // Draw a triangle
                doc
                    .save()
                    .moveTo(100, 150)
                    .lineTo(100, 250)
                    .lineTo(200, 250)
                    .fill('#FF3300');

                // Apply some transforms and render an SVG path with the 'even-odd' fill rule
                doc
                    .scale(0.6)
                    .translate(470, -380)
                    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
                    .fill('red', 'even-odd')
                    .restore();

                // Add some text with annotations
                doc
                    .addPage()
                    .fillColor('blue')
                    .text('Here is a link!', 100, 100)
                    .underline(100, 100, 160, 27, { color: '#0000FF' })
                    .link(100, 100, 160, 27, 'http://google.com/');

                // Finalize PDF file
                doc.end();

            } catch (error) {
                console.error(error);
                res.redirect('/logout');
            }

        });



    } catch (err) {
        console.error("ERROR purge");
    }


}