var db = require("google/appengine/ext/db");

var Category = require("./category").Category;

/**
 * An article is the basic content unit.
 * Follows the Atom Publishing Format.
 */
var Article = exports.Article = function(title, content) {
	this.title = title || "";
	this.content = content;
	this.created = this.updated = new Date();
	this.__key__ = db.key({kind: this.constructor.kind()});
}

db.Model.extend(Article, "Article", {
    category: new db.ReferenceProperty({referenceClass: Category, collectionName: "articles"}),
	title: new db.StringProperty({required: true}),
    summary: new db.TextProperty({}), 
	content: new db.TextProperty({required: true}),
	created: new db.DateTimeProperty({autoNowAdd: true}),
	updated: new db.DateTimeProperty({autoNow: true}),
	commentCount: new db.IntegerProperty({defaultValue: 0, editable: false}),
});

Article.prototype.path = function() {
    return "*" + this.key() + "/" + this.title;
}

Article.prototype.toString = function() {
    return this.title;
}
