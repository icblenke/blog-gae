var db = require("google/appengine/ext/db");

/**
 * A content category
 */
var Category = exports.Category = function(term, label, category) {
	this.term = term;
	this.label = label;
	if (category) this.category = category.key();
	this.__key__ = db.key({kind: this.constructor.kind(), name: term});
}

db.Model.extend(Category, "Category", {
	term: new db.StringProperty(),
	label: new db.StringProperty(),
	category: new db.ReferenceProperty({referenceClass: Category})
});

Category.prototype.toString = function() {
    return this.term;
}
