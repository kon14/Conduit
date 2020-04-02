const configModel = require('./models/ConfigModel');
const dbConfig = require('./utils/config/db-config');
const email = require('@conduit/email');
const authentication = require('@conduit/authentication');
const admin = require('@conduit/admin');
const cms = require('@conduit/cms').CMS;
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { getConfig, editConfig } = require('./handlers/config');

async function init(app) {
  await app.conduit.database.connectToDB(process.env.databaseType, process.env.databaseURL);
  registerSchemas(app.conduit.database);

  await dbConfig.configureFromDatabase(app);

  await admin.init(app);
  registerAdminRoutes(app.conduit.admin);

  if (await email.initialize(app)) {
    app.conduit.email = email;
  }
// authentication is always required, but adding this here as an example of how a module should be conditionally initialized
  if (app.conduit.config.get('authentication')) {
    authentication.initialize(app, app.conduit.config.get('authentication'));
  }

// initialize plugin AFTER the authentication so that we may provide access control to the plugins
  app.conduit.cms = new cms(app.conduit.database, app);

  app.use('/', indexRouter);
  app.use('/users', authentication.authenticate, usersRouter);
  return app;
}

function registerSchemas(database) {
  const db = database.getDbAdapter();
  db.createSchemaFromAdapter(configModel);
}

function registerAdminRoutes(admin) {
  admin.registerRoute('GET', '/config', (req, res, next) => getConfig(req, res, next).catch(next));
  admin.registerRoute('PUT', '/config', (req, res, next) => editConfig(req, res, next).catch(next));
}

module.exports = init;
