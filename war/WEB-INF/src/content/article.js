var crc32 = require("crc32").hash;

var db = require("google/appengine/ext/db");

var Category = require("./category").Category,
	Taggable = require("./taggable").Taggable,
    seo = require("./seo").encode;

/**
 * An article is the basic content unit.
 * Follows the Atom Publishing Format.
 */
var Article = exports.Article = function(title, content) {
	this.title = title;
	this.content = content;
	this.created = this.updated = new Date();
	this.commentCount = 0;
	this.__key__ = Article.key(this);
}

Article.model = new db.Model(Article, "Article", {
    category: new db.ReferenceProperty({referenceClass: Category}),
	title: new db.StringProperty({required: true}),
	content: new db.TextProperty({required: true}),
	created: new db.DateTimeProperty({autoNowAdd: true}),
	updated: new db.DateTimeProperty({autoNow: true}),
	commentCount: new db.IntegerProperty({defaultValue: 0, editable: false})
})

Article.key = function(obj) {
    obj.created = obj.created || new Date();
	return db.key("Article", "a" + crc32(obj.title + obj.created.format("yymmddHH")));
}

Article.prototype.path = function() {
    return "*" + db.keyToString(this.key()) + "/" + seo(this.title);
}

Article.prototype.toString = function() {
    return this.title;
}

Taggable(Article);
