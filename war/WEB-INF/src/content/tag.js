var crc32 = require("crc32").hash;

var db = require("google/appengine/ext/db");

var Tag = exports.Tag = function(name) {
	this.name = name;
	this.count = 0;
	this.__key__ = Tag.key("Tag", name);
};

Tag.model = new db.Model(Tag, "Tag", {
	name: new db.StringProperty(),
	count: new db.IntegerProperty()
});

Tag.key = function(obj) {
    return db.key("Tag", obj.name);
}

Tag.prototype.toString = function() {
    return this.name;
}

var TagRelation = exports.TagRelation = function(tag, target) {
	var tagKey = db.resolveKey(tag)
	this.target = target;
	
	this.setKey(db.key(
		tagKey, 
		"TagRelation", 
		crc32(db.keyToString(tagKey) + db.keyToString(target.key()))
	));
}

TagRelation.model = new db.Model(TagRelation, "TagRelation", {
	target: new db.ReferenceProperty(Tag),
	created: new db.DateTimeProperty()
});
