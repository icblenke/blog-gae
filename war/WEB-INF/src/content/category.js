var db = require("google/appengine/ext/db");

/**
 * A content category
 */
var Category = exports.Category = function(term, label, parentKey) {
	if (!term) throw new TypeError("Invalid term");
	
	if (parentKey)
		this.setKey(db.key(parentKey, "Category", term));
	else
		this.setKey(db.key("Category", term));
	
	this.term = term;
	this.label = label;
}

Category.model = new db.Model(Category, "Category", {
	term: new db.StringProperty(),
	label: new db.StringProperty()
});

Category.prototype.path = function() {
    return "*" + this.term;
}

Category.prototype.toString = function() {
    return this.term;
}
