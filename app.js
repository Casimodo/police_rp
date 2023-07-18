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
    SteamStrategy = require('./lib/passport-steam').Strategy;

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



try {

    //the path
    const httpRoutePath = path.join(__dirname, "routers_http"); //add one folder then put your route files there my router folder name is router
    const socketRoutePath = path.join(__dirname, "routers_socket"); //add one folder then put your route files there my router folder name is router
    const amqpRoutePath = path.join(__dirname, "routers_amqp"); //add one folder then put your route files there my router folder name is routers

    // ============== get env ================
    if (process.env.DB_HOST) { // Mode passage par env

        console.log("==== Mode full ENV ===========");
        var NODE_ENV = process.env.NODE_ENV
        var ENV_PORT = process.env.ENV_PORT;
        var PROTOCOL = process.env.PROTOCOL;
        var URL = process.env.URL;
        var STEAM_URL_RETURN = process.env.STEAM_URL_RETURN;
        var STEAM_API_KEY = process.env.STEAM_API_KEY;
        var WEB_SERVER_TOKEN = process.env.WEB_SERVER_TOKEN;
        var CONFIG_DB = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        };

    } else {                    // Utilisation en mode fichier de config

        console.log("==== Mode use config file ===========");
        var NODE_ENV = "dev";
        if (process.env.NODE_ENV) {
            NODE_ENV = process.env.NODE_ENV;
        }

        const CONFIG = require(`./configs/config_${NODE_ENV}.json`);

        var ENV_PORT = CONFIG.port;
        var PROTOCOL = CONFIG.protocol;
        var URL = CONFIG.url;
        var STEAM_URL_RETURN = CONFIG.steam.url_return;
        var STEAM_API_KEY = CONFIG.steam.api_key;
        var WEB_SERVER_TOKEN = CONFIG.web_server_token;
        var CONFIG_DB = {
            host: CONFIG.mariadb.host,
            user: CONFIG.mariadb.user,
            password: CONFIG.mariadb.password,
            database: CONFIG.mariadb.dbname,
            port: CONFIG.mariadb.port
        };

    }
    console.log(`===> ${PROTOCOL}`);

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Steam profile is serialized
    //   and deserialized.
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    //console.log(">>>>", CONFIG);
    // Use the SteamStrategy within Passport. 
    //   Strategies in passport require a `validate` function, which accept
    //   credentials (in this case, an OpenID identifier and profile), and invoke a
    //   callback with a user object.
    var realmValue = `${PROTOCOL}://${URL}/`;
    if (NODE_ENV == "dev") {
        realmValue = `${PROTOCOL}://${URL}:${ENV_PORT}/`;
    }

    console.log(`${STEAM_URL_RETURN} >> ${realmValue}`);

    passport.use(new SteamStrategy({
        returnURL: `${STEAM_URL_RETURN}`,
        realm: realmValue,
        apiKey: `${STEAM_API_KEY}`
    },
        function (identifier, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                // To keep the example simple, the user's Steam profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Steam account with a user record in your database,
                // and return that user instead.
                profile.identifier = identifier;
                return done(null, profile);
            });
        }
    ));

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
    app.use((req, res, next) => {

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
        if (req.user) {

            // get profile in db
            let database = require('./class/datasdb.class');
            let db = new database(CONFIG_DB, logger);
            db.connect(true).then(conn => {
                db.user_infos(conn, req.user.id).then(dt_players => {
                    req.user = Object.assign({}, req.user, { player: dt_players[0] });
                    conn.end();
                    next();

                }, err => {
                    logger.error(err);
                });
            }, err => {
                logger.error(err);
            });

        } else {
            next();
        }

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
            require(route)(CONFIG_DB, app, logger, ensureAuthenticated, passport);
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