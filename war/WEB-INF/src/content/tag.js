var db = require("google/appengine/ext/db");

var Tag = exports.Tag = function() {};

db.model(Tag, "Tag", {
	name: new db.StringProperty()
});

Tag.prototype.toString = function() {
    return this.name;
}

