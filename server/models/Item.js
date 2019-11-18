const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const Float = require('mongoose-float').loadType(mongoose);

let ItemModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  cost: {
    type: Float,
    min: 0,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  wears: {
    type: Number,
    min: 0,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

ItemSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

ItemSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return ItemModel.find(search).select('name').exec(callback);
};

ItemModel = mongoose.model('Item', ItemSchema);

module.exports.ItemModel = ItemModel;
module.exports.ItemSchema = ItemSchema;
