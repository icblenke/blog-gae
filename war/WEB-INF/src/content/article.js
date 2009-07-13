var crc32 = require("crc32").hash;

var db = require("google/appengine/ext/db");

var Category = require("./category").Category,
	Taggable = require("./taggable").Taggable,
    seo = require("./seo").encode;

/**
 * An article is the basic content unit.
 * Follows the Atom Publishing Format.
 */
var Article = exports.Article = function(categoryKey, title) {
	if (categoryKey) {
		this.created = this.updated = new Date();
		var keyName = "a" + crc32(title) + this.created.format("yymmdd");
		this.setKey(db.key(categoryKey, "Article", keyName));
	}
	this.title = title;
	this.commentCount = 0;
}

db.model(Article, "Article", {
	title: new db.StringProperty(),
	content: new db.TextProperty(),
	created: new db.DateProperty(),
	updated: new db.DateProperty(),
	commentCount: new db.IntegerProperty()
});

Object.include(Article, Taggable);

Article.prototype.path = function() {
    return "*" + db.keyToString(this.key()) + "/" + seo(this.title);
}

Article.prototype.toString = function() {
    return this.title;
}