require('dotenv-extended').load();

var axios = require('axios');
// var allConfigs = require('./../config');

var IncidentService = (function() {
  var config = {
    auth:{
      username: process.env.serviceNowLogin //|| allConfigs["serviceNowLogin"]
      ,password: process.env.serviceNowPassword// || allConfigs["serviceNowPassword"]
    }
  };

  var INCIDENT_TABLE = "api/now/table/incident";
  var RECORD_QUOTA = 10;
  
  return {
    getIncidents : function (criteria) {
      var queryStr = '?sysparm_limit=' + RECORD_QUOTA + '&';
      if (typeof criteria==='object' && criteria!==null && !(criteria instanceof Array) && !(criteria instanceof Date)){
        for(var key in criteria){
          queryStr += key + '=' + criteria[key] + '&';
        }
      }

      config["url"] = process.env.serviceNowUrl + INCIDENT_TABLE + queryStr;
      config["method"] = "get";

      return axios(config);
    }

    , getIncident : function (incidentId) {
      if (incidentId && incidentId.length > 0){
        config["url"] = process.env.serviceNowUrl + INCIDENT_TABLE + "/" + incidentId;
        config["method"] = "get";

        return axios(config);

      } else {
        throw "Incorrect incident id";
      }
    }

    , createIncident : function (incidentObj){
      config["url"] = process.env.serviceNowUrl + INCIDENT_TABLE;
      config["method"] = "post";
      config["data"] = incidentObj;

      return axios(config);
    }

    , updateIncident : function(incidentObj){
      if (incidentObj && incidentObj.hasOwnProperty("incident_id")){  
        var id = incidentObj.incident_id;

        config["url"] = process.env.serviceNowUrl + INCIDENT_TABLE + "/" + id;
        config["method"] = "put";
        config["data"] = incidentObj;

        return axios(config);

      } else {
        throw "Incorrect incident object -- missing id";
      }
    }
  }
})();

module.exports = IncidentService 