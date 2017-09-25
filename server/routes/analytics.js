var Conversations = require('../models/conversations');
var async = require('async');
var moment = require('moment');

module.exports = function(router) {

  router.get('/analytics/data', function(req, res) {
    Conversations.find({}, function(err, conversations) {
      if (err) res.send(err);
      else {
        res.json(conversations);
      }
    });
  });

  router.post('/analytics/status', function(req, res) {
    //console.log(req.body.dateFrom + " "  + req.body.dateTo );
    var dateFrom = moment(req.body.dateFrom).startOf('day');
    var dateTo = moment(req.body.dateTo).endOf('day');
    //console.log(dateFrom + " " + dateTo)
    dateFrom = new Date(dateFrom).toISOString();
    dateTo = new Date(dateTo).toISOString();

    var analytics = [];

    Conversations
      .aggregate([{
        $match: {
          $and: [{
            'messages.timestamp': {
              $gte: new Date(dateFrom),
              $lt: new Date(dateTo)
            }
          }, {
            'profile.originPage': 'buytv'
          }]
        }
      }, {
        $group: {
          _id: "$status",
          number: {
            $sum: 1
          }
        }
      }], function(err, results) {
        if (err) res.json(err)
        else {
          console.log(results)
          analytics.push({
            'status': results
          })
          Conversations
            .aggregate([{
                $match: {
                  status: "Abandoned",
                  'messages.timestamp': {
                    $gte: new Date(dateFrom),
                    $lt: new Date(dateTo)
                  }
                }
              },
              {
                $group: {
                  _id: "$profile.topic",
                  number: {
                    $sum: 1
                  }
                }
              }
            ], function(err, results) {
              if (err) res.json(err)
              else {
                analytics.push({
                  'abandoned': results
                })

                Conversations
                  .aggregate([{
                      $match: {
                        status: "Delegated",
                        'messages.timestamp': {
                          $gte: new Date(dateFrom),
                          $lt: new Date(dateTo)
                        }
                      }
                    },
                    {
                      $group: {
                        _id: "$profile.topic",
                        number: {
                          $sum: 1
                        }
                      }
                    }
                  ], function(err, results) {
                    if (err) res.json(err)
                    else analytics.push({
                      'delegated': results
                    })
                    // console.log(JSON.stringify(analytics, null, 2))
                    res.json(analytics)
                  });
              }
            })
        }
      })
  });

  router.post('/analytics/data/products', function(req, res) {
    var dateFrom = moment(req.body.dateFrom).startOf('day');
    var dateTo = moment(req.body.dateTo).endOf('day');

    dateFrom = new Date(dateFrom).toISOString();
    dateTo = new Date(dateTo).toISOString();

    Conversations.find({
        status: 'Completed: Application Progressed',
        'messages.timestamp': {
          $gte: new Date(dateFrom),
          $lt: new Date(dateTo)
        }
      },
      function(err, conversations) {
        if (err) res.send(err);
        else {
          console.log("conversations", conversations);
          res.json(conversations);
        }
      });
  });

};
