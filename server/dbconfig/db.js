var mongoose = require('mongoose')

//10.136.40.120

// mongoose.connect('mongodb://mongo/rma', function(err) {
//   if (err) console.log(err);
//   else console.log('Connected');
// });

//if (env === 'development') {
  location = 'localhost';
//}
mongoose.connect('mongodb://' + location + '/rma', function(err) {
  if (err) console.log(err);
  else console.log('Connected');
});
