var db = require("google/appengine/ext/db");

var Tag = exports.Tag = function(name) {
	this.name = name;
	this.count = 0;
	this.setKey(db.key("Tag", name));
};

db.model(Tag, "Tag", {
	name: new db.StringProperty(),
	count: new db.IntegerProperty()
});

Tag.prototype.toString = function() {
    return this.name;
}