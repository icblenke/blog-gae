require.paths.unshift("WEB-INF/src");

require("oop");

require("nitro");
	
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

var Template = require("nitro/utils/xsltemplate").Template;

var Wrap = require("./src/wrap").Wrap;

exports.app = MethodOverride(Normalize(SessionManager(Render(Wrap(Dispatch())), "sessionsecret")));

exports.development = function(app) {
	throw new Error("You cannot launch a Google App Engine application with jackup");
}

exports.local = function(app) {
	CONFIG.reload = true;
	CONFIG.root = "WEB-INF/src/root";
	CONFIG.templateRoot = "WEB-INF/src/templates";
	CONFIG.xslPath = "WEB-INF/src/html.xsl";
	return ShowExceptions(Lint(ContentLength(Cascade([File("."), app]))));
}

exports.gae = function(app) {
	CONFIG.reload = true;
	CONFIG.root = "WEB-INF/src/root";
	CONFIG.templateRoot = "WEB-INF/src/templates";
	CONFIG.xslPath = "WEB-INF/src/html.xsl";
	return ContentLength(app);
}