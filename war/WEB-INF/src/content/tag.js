var crc32 = require("crc32").hash;

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

var TagRelation = exports.TagRelation = function(tag, target) {
	var tagKey = db.resolveKey(tag)
	this.targetKey = db.resolveKey(target);
	
	this.setKey(db.key(
		db.resolveKey(tag), 
		"TagRelation", 
		crc32(db.keyToString(tagKey) + db.keyToString(this.targetKey))
	));
}

db.model(TagRelation, "TagRelation", {
	targetKey: new db.ReferenceProperty(),
	created: new db.DateTimeProperty()
});