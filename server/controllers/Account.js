const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'all fields required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'wrong username or password stinky' });
    }
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'all fields required ya dweeb' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'passwords dont match!!! >:(' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'username already in use dummyyy.' });
      }

      return res.status(400).json({ error: 'an error occurred oopsie' });
    });
  });
};

const passwordChange = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'all fields required ya dweeb' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'passwords dont match!!! >:(' });
  }

  return Account.AccountModel.authenticate(
    req.session.account.username,
    req.body.oldPass,
    (err1, account) => {
      if (err1 || !account) {
        return res.status(401).json({ error: 'wrong username or password stinky' });
      }

      return Account.AccountModel.generateHash(
        req.body.pass,
        (salt, hash) => Account.AccountModel.findByUsername(
          req.session.account.username,
          (err2, doc) => {
            if (err2) {
              console.log(err2);
              return res.status(400).json({ error: 'an error occurred oopsie' });
            }
  
            let updatedDoc = doc;
            updatedDoc.salt = salt;
            updatedDoc.password = hash;
  
            const savePromise = updatedDoc.save();
  
            savePromise.then(() => res.json({ redirect: '/maker' }));
  
            savePromise.catch((err3) => {
              console.log(err3);
              return res.status(400).json({ error: 'an error occurred oopsie' });
            });
  
            return savePromise;
          }));
    }
  );
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.passwordChange = passwordChange;
module.exports.getToken = getToken;
