var db = require("google/appengine/ext/db");

var Category = require("./category").Category,
    slugify = require("./utils").slugify;

/**
 * An article is the basic content unit.
 * Follows the Atom Publishing Format.
 */
var Article = exports.Article = db.Model("Article", {
    category: new db.ReferenceProperty({referenceClass: Category}),
	title: new db.StringProperty({required: true}),
    summary: new db.TextProperty(), 
	content: new db.TextProperty({required: true}),
	created: new db.DateTimeProperty({autoNowAdd: true}),
	updated: new db.DateTimeProperty({autoNow: true}),
});

Object.defineProperty(Article.prototype, "slug", {
    get: function() {
        return slugify(this.title);
    }
});

Article.prototype.path = function() {
    return "*" + this.key() + "/" + slugify(this.title);
}

Article.prototype.toString = function() {
    return this.title;
}
