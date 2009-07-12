var db = require("google/appengine/ext/db");

/**
 * A content category
 */
var Category = exports.Category = function(term, label) {
	if (!term) throw new TypeError("Invalid term");
	
	this.setKey(db.key("Category", term));
	this.term = term;
	this.label = label;
}

db.model(Category, "Category", {
	term: new db.StringProperty(),
	label: new db.StringProperty()
});

Category.prototype.path = function() {
    return "*" + this.term;
}

Category.prototype.toString = function() {
    return this.term;
}