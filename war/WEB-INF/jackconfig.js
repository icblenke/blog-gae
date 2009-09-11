var root = system.fs.dirname(module.path),
    appsRoot = system.fs.join(root, "src/apps"),
    templatesRoot = system.fs.join(root, "src/templates");

require.paths.unshift(system.fs.join(root, "src"));

var ContentLength = require("jack/contentlength").ContentLength,
    MethodOverride = require("jack/methodoverride").MethodOverride,
    ShowExceptions = require("jack/showexceptions").ShowExceptions,
    Lint = require("jack/lint").Lint; 
        
var Dispatch = require("nitro/dispatch").Dispatch,
    Path = require("nitro/path").Path,
    Errors = require("nitro/errors").Errors,
    SessionManager = require("nitro/sessionmanager").SessionManager,
    Render = require("nitro/render").Render;		
    
require("./src/dateutils");

var Wrap = require("./src/wrap").Wrap;

// The application.
exports.app = ContentLength(MethodOverride(SessionManager(Path(Render(Errors(Wrap(Dispatch(appsRoot))), templatesRoot)), "sessionsecret")));

// Debug version of the application.
exports.debug = ShowExceptions(exports.app);

// Run on development server.
exports.local = function(app) {
    return require("jack/reloader").Reloader(module.id, "debug");
}

// Run on Google App Engine hosting infrastructure.
exports.hosted = function(app) {
	return app;
}
