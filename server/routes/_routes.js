var router = require('express').Router();

require('./analytics')(router);
require('./converse')(router);
//require('./conversationLogs')(router);
require('./login')(router);
require('./products')(router);
require('./speech')(router);
require('./classify')(router);
require('./train')(router);
require('./analyse')(router);
require('./conversations')(router);
require('./authentication.js')(router);

const fs = require('fs');
// //yoti reqs
// const YotiClient = require('yoti-node-sdk')
// const SDK_ID = '0125c5a2-54b9-4961-8442-c56be7153fbd'
// const PEM_PATH = '../server/Alexa-Yoti-Test-access-security.pem'
// const PEM = fs.readFileSync(PEM_PATH)

// var yotiClient = new YotiClient(SDK_ID, PEM)
//
//
router.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: './../app'
  });
});
// router.get('/chat', function(req, res){
//     "use strict";
//     let token = req.query.token
//     if(!token) {
//         res.render('pages/error', {
//             error : "No token has been provided."
//         });
//         return
//     }
//     let promise = yotiClient.getActivityDetails(token).then((activityDetails) => {
//         res.render('pages/profile', {
//             userId  : activityDetails.getUserId(),
//             profile : activityDetails.getUserProfile(),
//             outcome : activityDetails.getOutcome()
//         })
//
//           // res.redirect("/#/chat");
//     }).catch((err) => {
//         console.error(err)
//     })
//    res.redirect("/#/chat");
//
//
//   res.sendFile('index.html', {root:  './../app'});
// })

module.exports = router
