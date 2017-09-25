var Products = require('../models/products');

module.exports = function(router) {
  router.post('/watson/products/recommendation', function(req, res) {
    Products.find({
      rateType:         req.body.rateType,
      introductoryTerm: req.body.initTerm,
      overpayments:     req.body.overpayments,
      fee:              req.body.fees
    },
      function(err, products) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(products);
        }
    });
  });

  router.post('/products/recommendation', function(req, res) {
    var rateTypeDB =  req.body.rateType;
    var introductoryTermDB = req.body.introductoryTerm;
    if (rateTypeDB == 'fixed') {
      rateTypeDB = 'Fixed Rate';
    } else if(rateTypeDB == 'variable') {
      rateTypeDB = 'Tracker';
    }

    NinaProducts.find({
      rateType: rateTypeDB,
      introductoryTerm: introductoryTermDB,
      overpayments: req.body.overpayments,
      fee: req.body.fee
    },
      function(err, products) {
      if (err) res.send(err);
      else res.json(products);
    });
  });

  router.get('/products/product/:productId', function(req, res) {
    var id = req.param('productId')
    var productId = require('mongodb').ObjectID(id);

    Products.findOne({ "_id": productId },
      function(err, product) {
        if (err) res.send(err);
        else res.json(product);
    });
  });
};
