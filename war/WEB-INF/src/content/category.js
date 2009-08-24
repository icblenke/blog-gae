var db = require("google/appengine/ext/db");

/**
 * A content category
 */
var Category = exports.Category = function(term, label, category) {
	this.term = term;
	this.label = label;
	this.category = category;
	this.__key__ = Category.key(this);
}

Category.model = new db.Model(Category, "Category", {
	term: new db.StringProperty(),
	label: new db.StringProperty(),
	category: new db.ReferenceProperty({referenceClass: Category})
});

Category.key = function(obj) {
    return db.key("Category", obj.term);
}

Category.prototype.path = function() {
    return "*" + this.term;
}

Category.prototype.toString = function() {
    return this.term;
}
