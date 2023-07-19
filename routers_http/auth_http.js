module.exports = function (config, app, logger, ensureAuthenticated, passport) {

  let self = this;
  const path = require('path');
  self.database = require('../class/datasdb.class.js');
  self.db = new self.database(config, logger);
  self.outilsClass = require('../class/utils.class.js');
  self.outils = new self.outilsClass();

  try {

    /** GET /login
     *
     * This route prompts the user to log in.
     *
     * The 'login' view renders an HTML form, into which the user enters their
     * username and password.  When the user submits the form, a request will be
     * sent to the `POST /login/password` route.
     *
     * @openapi
     * /login:
     *   get:
     *     summary: Prompt the user to log in using a username and password
     *     responses:
     *       "200":
     *         description: Prompt.
     *         content:
     *           text/html:
     */
    app.get('/login', function (req, res, next) {
      res.render('pages/login', {
        PARAMS: req.PARAMS,
        I18N: req.I18N,
        page_name: 'login',
        user: req.user
      });
    });

    /** POST /login/password
     *
     * This route authenticates the user by verifying a username and password.
     *
     * A username and password are submitted to this route via an HTML form, which
     * was rendered by the `GET /login` route.  The username and password is
     * authenticated using the `local` strategy.  The strategy will parse the
     * username and password from the request and call the `verify` function.
     *
     * Upon successful authentication, a login session will be established.  As the
     * user interacts with the app, by clicking links and submitting forms, the
     * subsequent requests will be authenticated by verifying the session.
     *
     * When authentication fails, the user will be re-prompted to login and shown
     * a message informing them of what went wrong.
     *
     * @openapi
     * /login/password:
     *   post:
     *     summary: Log in using a username and password
     *     requestBody:
     *       content:
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: number
     *     responses:
     *       "302":
     *         description: Redirect.
     */
    app.post('/login/password',
      passport.authenticate('local', { failureRedirect: '/login' }),
      function (req, res) {
        res.redirect('/');
      });

    /* POST /logout
     *
     * This route logs the user out.
     */
    app.post('/logout', function (req, res, next) {
      req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });

    /* GET /signup
     *
     * This route prompts the user to sign up.
     *
     * The 'signup' view renders an HTML form, into which the user enters their
     * desired username and password.  When the user submits the form, a request
     * will be sent to the `POST /signup` route.
     */
    app.get('/signup', function (req, res, next) {
      res.render('pages/agents/new', {
        PARAMS: req.PARAMS,
        I18N: req.I18N,
        page_name: 'new_agent',
        user: req.user
      });
    });

    /* POST /signup
     *
     * This route creates a new user account.
     *
     * A desired username and password are submitted to this route via an HTML form,
     * which was rendered by the `GET /signup` route.  The password is hashed and
     * then a new user record is inserted into the database.  If the record is
     * successfully created, the user is logged in.
     */
    app.post('/signup', function (req, res, next) {
      var salt = crypto.randomBytes(16);
      crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) { return next(err); }
        db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
          req.body.username,
          hashedPassword,
          salt
        ], function (err) {
          if (err) { return next(err); }
          var user = {
            id: this.lastID,
            username: req.body.username
          };
          req.login(user, function (err) {
            if (err) { return next(err); }
            res.redirect('/');
          });
        });
      });
    });


  } catch (err) {
    console.error("ERROR auth");
  }


}