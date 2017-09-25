var Users = require('../models/users');

module.exports = function(router) {
  router.post('/user/login', function(req, res) {
    Users.findOne({ username: req.body.username, password: req.body.password }, function(err, user) {
      if (err) throw err;
      if(user == null) {
        return res.status(200).json({
          message: 'No user exists with those credentials.'
        });
      } else {
        return res.status(200).json({
          message: 'Success',
          user: user._id
        });
      }
    });
  });

  router.post('/user/verify', function(req, res) {
    Users.findOne({ _id: req.body.userId }, function(err, user) {
      if (err) throw err;
      if(user == null) {
        return res.status(200).json({
          message: 'No user exists with those credentials.'
        });
      } else {
        return res.status(200).json({
          message: 'Success',
          user: user._id
        });
      }
    });
  });
};
