require('dotenv-extended').load();

var KnowledgeService = (function() {

  return {
	/**
	* Finds the help documentation for a given task.
	* @constructor 
	* @param {String} task - What the user wants help on (ex. "how do i change my email signature?")
	* @param {String} appName - the name of the app user wants help on (ex. "Outlook 2010")
	* @param {String} appVersion - the version of the app (ex. "2010")
	* @param {String} osName - the version of the computer's OS (ex. "Windows 7")
	* @param {String} osVersion - the version of the computer's OS (ex. "build 21.789")
	* @return {String} helpDoc - help document with instructions, screenshots and links.
	*/ 
    search : function(task, appName, appVersion, osName) {

      // integrate with watson service here
      return;  
    }

  }
})();

module.exports = KnowledgeService 