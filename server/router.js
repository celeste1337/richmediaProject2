const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getItems', mid.requiresLogin, controllers.Item.getItems);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/passwordChange', mid.requiresSecure, mid.requiresLogin, controllers.Account.passwordChange);
  app.get('/maker', mid.requiresLogin, controllers.Item.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Item.make);
  app.post('/updateItem', mid.requiresLogin, controllers.Item.updateItem);
  app.post('/deleteItem', mid.requiresLogin, controllers.Item.deleteItem);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
