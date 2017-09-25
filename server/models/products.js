var mongoose = require('mongoose');

module.exports = mongoose.model('Products', {
  productName:      { type: String },
  rateType:         { type: String },
  introductoryTerm: { type: Number },
  ratePercent:      { type: Number },
  fee:              { type: Number },
  ltv:              { type: Number },
  ercPercent:       { type: String },
  ercDate:          { type: String },
  overpayments:     { type: Number }
});
