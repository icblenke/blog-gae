var db = require("google/appengine/ext/db");

var Tag = exports.Tag = function(name) {
	this.name = name;
	this.count = 0;
	this.__key__ = db.key({kind: this.constructor.kind(), name: name});
};

db.Model.extend(Tag, "Tag", {
	name: new db.StringProperty(),
	count: new db.IntegerProperty()
});

Tag.prototype.toString = function() {
    return this.name;
}

var TagRelation = exports.TagRelation = function(tag, target) {
	this.target = target;
    this.__key__ = db.key({parent: tag, kind: this.constructor.kind()});
}

TagRelation.model = new db.Model(TagRelation, "TagRelation", {
	target: new db.ReferenceProperty({referenceClass: Tag}),
	created: new db.DateTimeProperty()
});
