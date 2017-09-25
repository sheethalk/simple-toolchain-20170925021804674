const fs = require('fs');

module.exports = function(router) {

  var auth = false;

  router.get('/verify', function(req, res){
    console.log("TEST")
      "use strict";
      var token = req.query.token;
      if(!token) {
        console.log("No token")
          // res.render('pages/error', {
          //     error : "No token has been provided."
          // });
          //;
          res.send("Err0r");
          return
      }
      var promise = yotiClient.getActivityDetails(token).then((activityDetails) => {
        console.log("Promises")
          var userId  = activityDetails.getUserId()
          var profile = activityDetails.getUserProfile()
          var outcome = activityDetails.getOutcome()
          auth = true
          setTimeout(function(){
            auth = false;
          }, 30000)
          res.redirect("/#/verify");
          // console.log("test")
          res.sendFile('index.html', {root:  './../app'});


      }).catch((err) => {
          console.error(err)
      })
      console.log("Nothing ")
      res.sendFile('index.html', {root:  './../app'});
    // res.sendFile('verify.html', {root:  './../app'});
  });

  router.get('/auth', function (req, res){
    res.send(auth);
  })

};
