require('dotenv-extended').load();

var axios = require('axios');
// var allConfigs = require('./../config');

var SysUserService = (function() {
  var config = {
    auth:{
      username: process.env.serviceNowLogin //|| allConfigs["serviceNowLogin"]
      ,password: process.env.serviceNowPassword // || allConfigs["serviceNowPassword"]
    }
  };

  var SYS_USER_TABLE = "api/now/table/sys_user";
  var RECORD_QUOTA = 10;
  var PASSWORD_MAX_LENGTH = 10;

  var generateRandomPassword = function ()
  {
      var bits = 36;
      var length = PASSWORD_MAX_LENGTH;
      var randomPassword = "", newStr;

      while (randomPassword.length < length)
      {
          newStr = Math.random().toString(bits).slice(2);
          randomPassword += newStr.slice(0, Math.min(newStr.length, (length - randomPassword.length)));
      }
      return randomPassword.toUpperCase();
  }

  return {
    getSysUsers : function (criteria) {
      var queryStr = '?sysparm_limit=' + RECORD_QUOTA + '&';
      if (typeof criteria==='object' && criteria!==null && !(criteria instanceof Array) && !(criteria instanceof Date)){
        for(var key in criteria){
          queryStr += key + '=' + criteria[key] + '&';
        }
      }
      if (queryStr.length >0){
        queryStr = queryStr.substring(0, queryStr.length-1);
        queryStr = encodeURI(queryStr);
      }

      config["url"] = process.env.serviceNowUrl + SYS_USER_TABLE + queryStr;
      config["method"] = "get";

      return axios(config);
    }
      
    , resetPassword : function(sys_id){
      var newPassword = generateRandomPassword();
      var sysUserObj = {
        'sys_id': sys_id  , 
        'locked_out' : 'false'
        , 'password_needs_reset' : 'false'
        , 'user_password' : newPassword
      };

      return this.updateSysUser(sysUserObj);
    }

    , updateSysUser : function(sysUserObj){
      if (sysUserObj && sysUserObj.hasOwnProperty("sys_id")){  
        var id = sysUserObj.sys_id;

        config["url"] = process.env.serviceNowUrl + SYS_USER_TABLE + "/" + id;
        config["method"] = "put";
        config["data"] = sysUserObj;

        return axios(config);

      } else {
        throw "Incorrect sys user object -- missing id";
      }
    }

    , getTableLink : function() { // to be deprecated 
      return process.env.serviceNowUrl + SYS_USER_TABLE;
    }
    // , getIncident : function (incidentId) {
    //   if (incidentId && incidentId.length > 0){
    //     config["url"] = process.env.serviceNowUrl + INCIDENT_TABLE + "/" + incidentId;
    //     config["method"] = "get";

    //     return axios(config);

    //   } else {
    //     throw "Incorrect incident id";
    //   }
    // }

    // , createIncident : function (incidentObj){
    //   config["url"] = process.env.serviceNowUrl + INCIDENT_TABLE;
    //   config["method"] = "post";
    //   config["data"] = incidentObj;

    //   return axios(config);
    // }
  }
})();

module.exports = SysUserService 