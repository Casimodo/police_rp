// standard packages
var express = require('express'),
    app = express(),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    fs = require('fs'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    path = require('path'),
    moment = require("moment"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    crypto = require('crypto'),
    dotenv = require('dotenv');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    label,
    printf
} = format; // log setup    

dotenv.config();

try {

    //the path
    const httpRoutePath = path.join(__dirname, "routers_http"); //add one folder then put your route files there my router folder name is router
    const socketRoutePath = path.join(__dirname, "routers_socket"); //add one folder then put your route files there my router folder name is router
    const amqpRoutePath = path.join(__dirname, "routers_amqp"); //add one folder then put your route files there my router folder name is routers

    // ============== get env ================
    if (process.env.DATABASE_URL) { // Mode passage par env

        console.log("==== Mode full ENV ===========");
        var NODE_ENV = process.env.NODE_ENV
        var ENV_PORT = process.env.ENV_PORT;
        var PROTOCOL = process.env.PROTOCOL;
        var URL = process.env.URL;
        var WEB_SERVER_TOKEN = process.env.WEB_SERVER_TOKEN;

    }

    //console.log(">>>>", CONFIG);
    // Use the SteamStrategy within Passport. 
    //   Strategies in passport require a `validate` function, which accept
    //   credentials (in this case, an OpenID identifier and profile), and invoke a
    //   callback with a user object.
    var realmValue = `${PROTOCOL}://${URL}/`;
    if (NODE_ENV == "dev") {
        realmValue = `${PROTOCOL}://${URL}:${ENV_PORT}/`;
    }

    /**
     * For log
     */
    const myFormat = printf(({
        level,
        message,
        label,
        timestamp
    }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });

    const logger = createLogger({
        format: combine(
            label({
                label: 'police_rp_logger'
            }),
            timestamp(),
            myFormat
        ),
        transports: [new transports.Console()]
    });

    // init express
    app.set("view engine", "ejs");
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session({
        secret: WEB_SERVER_TOKEN,
        name: 'rp_web_site',
        resave: true,
        saveUninitialized: true,
        cookie: { expires: 3600000 }
    }));

    /* Configure password authentication strategy.
    *
    * The `LocalStrategy` authenticates users by verifying a username and password.
    * The strategy parses the username and password from the request and calls the
    * `verify` function.
    *
    * The `verify` function queries the database for the user record and verifies
    * the password by hashing the password supplied by the user and comparing it to
    * the hashed password stored in the database.  If the comparison succeeds, the
    * user is authenticated; otherwise, not.
    */
    passport.use(new LocalStrategy(async function verify(username, password, done) {
        try {
            //const user = await prisma.players.findUnique({ where: { username }});    
            const user = (await prisma.$queryRaw`SELECT players.*, grades.* FROM players LEFT JOIN grades ON players.grade = grades.key WHERE username = ${username} AND actif = 1 LIMIT 1;`)[0];
            
            if (!user) { return done(null, false); }

            const isValid = await new Promise((resolve) => {
                crypto.scrypt(password, WEB_SERVER_TOKEN, 64, (err, derivedKey) => {
                    if (err) throw err;
                    console.log(">>>>>", derivedKey.toString('hex'));
                    resolve(derivedKey.toString('hex') === user.password);
                });
            });

            if (isValid) {
                return done(null, user);
            }

            return done(null, false);

        } catch (err) {
            console.error(err);
            return done(null, false);
        }
        
    }));

    /* Configure session management.
    *
    * When a login session is established, information about the user will be
    * stored in the session.  This information is supplied by the `serializeUser`
    * function, which is yielding the user ID and username.
    *
    * As the user interacts with the app, subsequent requests will be authenticated
    * by verifying the session.  The same user information that was serialized at
    * session establishment will be restored when the session is authenticated by
    * the `deserializeUser` function.
    *
    * Since every request to the app needs the user ID and username, in order to
    * fetch todo records and render the user element in the navigation bar, that
    * information is stored in the session.
    */
    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, { id: user.id, username: user.username });
            cb(null, user);
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    // Statics files
    app.use(express.static("public"));
    app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
    app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
    app.use('/bootstrap-select', express.static(__dirname + '/node_modules/bootstrap-select/dist/'));
    app.use('/bootstrap-select', express.static(__dirname + '/node_modules/bootstrap-select/dist/'));
    app.use('/feather-icons', express.static(__dirname + '/node_modules/feather-icons/dist/'));
    app.use('/assets/img', express.static(__dirname + '/node_modules/bootstrap-icons/icons/'));
    app.use('/popperjs', express.static(__dirname + '/node_modules/@popperjs/core/dist/umd/'));

    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(favicon(__dirname + '/public/img/favicon.ico'));
    //app.use(logger(CONFIG.loglevel));


    /** ****************************************************************************
     * 
     * Surcharge app.use for include CONFIG and TRANSLATE for Client IHM
     * 
     **************************************************************************** */
    app.use(async (req, res, next) => {

        res.locals.moment = moment;

        // Send config to front
        req.config = {
            port: ENV_PORT,
            env: NODE_ENV
        };

        req.PARAMS = {
            host: `${PROTOCOL}://${req.headers.host.toString()}`,
        };

        // No cache
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');

        // If identifer good get db data
        /*if (req.user) {

            // get profile in db
            let database = require('./class/datasdb.class');
            let db = new database(logger);

            req.user = Object.assign({}, req.user, { 
                //player: await db.user_infos(req.user.id) 
                player: prisma.players.findUnique({ where: { id : req.user.id }})
            });

            // db.user_infos(req.user.id).then(dt_players => {
            //     req.user = Object.assign({}, req.user, { player: dt_players[0] });
            //     next();

            // }, err => {
            //     logger.error(err);
            // });

        }*/
        next();

    });


    /** ****************************************************************************
     * 
     * loading routes for http
     * 
     **************************************************************************** */
    try {

        // Simple route middleware to ensure user is authenticated.
        //   Use this route middleware on any resource that needs to be protected.  If
        //   the request is authenticated (typically via a persistent login session),
        //   the request will proceed.  Otherwise, the user will be redirected to the
        //   login page.
        var ensureAuthenticated = function (req, res, next) {
            if (req.isAuthenticated()) { return next(); }
            res.redirect('/');
        }

        // browse class files for HTTP services
        fs.readdirSync(httpRoutePath).forEach(function (file) {
            var route = path.join(httpRoutePath, file);
            require(route)(undefined, app, logger, ensureAuthenticated, passport);
            console.info(`run http routers: ${file}`);
        });

    } catch (error) {
        console.error(`ERROR http routers : `, error);
    }


    /** ****************************************************************************
     * 
     * Start server and listen
     * 
     **************************************************************************** */
    server = app.listen(ENV_PORT, () => {
        console.log(`Server starting on ${ENV_PORT} test with ${PROTOCOL}://${URL}:${ENV_PORT}`);
    });


} catch (error) {
    console.error(error);
    console.error(`\r\n******************************************************************************\r\n\ERROR: for start program use "pm2 start ecosystem.json --env development" \r\n******************************************************************************`);
}