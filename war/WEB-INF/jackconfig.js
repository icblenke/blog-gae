require.paths.unshift("WEB-INF/src");

require("nitro");
require("oop");
require("dateutils");

var ContentLength = require("jack/contentlength").ContentLength,
    MethodOverride = require("jack/methodoverride").MethodOverride,
    ShowExceptions = require("jack/showexceptions").ShowExceptions,
    Lint = require("jack/lint").Lint; 
        
var Dispatch = require("nitro/dispatch").Dispatch,
	Normalize = require("nitro/normalize").Normalize,
	Errors = require("nitro/errors").Errors,
	SessionManager = require("nitro/sessionmanager").SessionManager,
	Render = require("nitro/render").Render;
		
var Wrap = require("./src/wrap").Wrap;

CONFIG.root = "WEB-INF/src/root";
CONFIG.templateRoot = "WEB-INF/src/templates";

// The application.
exports.app = ContentLength(MethodOverride(Normalize(Errors(SessionManager(Render(Wrap(Dispatch())), "sessionsecret")))));
exports.debug = ShowExceptions(exports.app);

// Run on development server.
exports.local = function(app) {
    return require("jack/reloader").Reloader(module.id, "debug");
}

// Run on Google App Engine hosting infrastructure.
exports.hosted = function(app) {
	return app;
}
