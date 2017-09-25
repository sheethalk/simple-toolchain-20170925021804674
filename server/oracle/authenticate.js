require('dotenv-extended').load();

var AuthenticationService = (function() {

  return {
    authenticate : function(){
      return;  
    }

    , isUserLocked : function(){
      return true;
    }

  }
})();

module.exports = AuthenticationService 