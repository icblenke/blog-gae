require.paths.unshift("WEB-INF/src");

require("nitro");
require("oop");
require("dateutils");
	
var File = require("jack/file").File, 
    ContentLength = require("jack/contentlength").ContentLength,
    MethodOverride = require("jack/methodoverride").MethodOverride,
    ShowExceptions = require("jack/showexceptions").ShowExceptions,
    Lint = require("jack/lint").Lint,    
    Cascade = require("jack/cascade").Cascade;

var Dispatch = require("nitro/dispatch").Dispatch,
	Normalize = require("nitro/normalize").Normalize,
	Errors = require("nitro/errors").Errors,
	SessionManager = require("nitro/sessionmanager").SessionManager,
	Render = require("nitro/render").Render;
		
var Wrap = require("./src/wrap").Wrap;

CONFIG.root = "WEB-INF/src/root";
CONFIG.templateRoot = "WEB-INF/src/templates";

exports.app = MethodOverride(Normalize(Errors(SessionManager(Render(Wrap(Dispatch())), "sessionsecret"))));

exports.development = function(app) {
	throw new Error("You cannot launch a Google App Engine application with jackup");
}

exports.local = function(app) {
	CONFIG.reload = true;
	return ShowExceptions(ContentLength(Cascade([File("."), app])));
}

exports.gae = function(app) {
	CONFIG.reload = false;
	return ContentLength(app);
}
