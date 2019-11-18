const models = require('../models');
const Item = models.Item;

const makerPage = (req, res) => {
  Item.ItemModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), items: docs });
  });
};

const makeItem = (req, res) => {
  if (!req.body.name || !req.body.imageUrl) {
    return res.status(400).json({ error: 'name and url are required' });
  }

  const itemData = {
    name: req.body.name,
    cost: req.body.cost,
    imageUrl: req.body.imageUrl,
    wears: req.body.wears,
    owner: req.session.account._id,
  };

  const newItem = new Item.ItemModel(itemData);

  const itemPromise = newItem.save();

  itemPromise.then(() => res.json({ redirect: '/maker' }));

  itemPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Item already exists' });
    }

    return res.status(400).json({ error: 'Something super weird happened.' });
  });

  return itemPromise;
};

const getItems = (request, response) => {
  const req = request;
  const res = response;

  return Item.ItemModel.findByOwner(req.session.account._id, (err, docs) => {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'Something went wrong.'});
    }

    return res.json({ items: docs });
  });
};


module.exports.makerPage = makerPage;
module.exports.getItems = getItems;
module.exports.make = makeItem;