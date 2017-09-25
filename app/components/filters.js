angular
  .module('RoboticMortgageAdvisor.Filters', [])
  .filter('unique', function() {
    return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
        var key = item.profile[0].name;
          if (keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
    };
  })
  .filter('searchFilter', function () {
    return function (arraytosearch, criteria) {
      var filtered = [];
      if (criteria.formName) {
        for (var i = 0; i < arraytosearch.length; i++) {
          if (arraytosearch[i].customer_name == criteria.formName) filtered.push(arraytosearch[i])
        }

        return filtered;
      }
      return true;
    }
  })
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  })
  .filter('uniqueTopic', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item.profile[0].topic;
          if (key) {
            if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
            }
          }
      });

      return output;
   };
 }).filter('reverse',function(){
    return function(items){
        return items.slice().reverse();
    }
  });
