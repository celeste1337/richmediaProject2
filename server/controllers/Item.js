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
  //console.log(req.body);
  if (!req.body.name || !req.body.cost || !req.body.itemUrl || !req.body.wears) {
    return res.status(400).json({ error: 'name, cost, wears & imageURL are required' });
  }

  const itemData = {
    name: req.body.name,
    cost: req.body.cost,
    imageUrl: req.body.itemUrl,
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

//update ze itemme
const updateItem = (request, response) => {
  const req = request;
  const res = response;
  return Item.ItemModel.findByOwnerAndID(
    req.session.account._id,
    req.body._id,
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      const updatedDoc = doc[0];

      updatedDoc.name = req.body.name;
      updatedDoc.cost = req.body.cost;
      updatedDoc.imageUrl = req.body.itemUrl;
      updatedDoc.wears = req.body.wears;

      const updateTaskPromise = updatedDoc.save();

      updateTaskPromise.then(() => res.json({ redirect: '/maker' }));

      updateTaskPromise.catch((err2) => {
        console.log(err2);

        return res.status(400).json({ error: 'An error occurred' });
      });

      return updateTaskPromise;
    });
};

const getItems = (request, response) => {
  const req = request;
  const res = response;

  return Item.ItemModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Something went wrong.' });
    }

    return res.json({ items: docs });
  });
};


module.exports.makerPage = makerPage;
module.exports.getItems = getItems;
module.exports.make = makeItem;
module.exports.updateItem = updateItem;
