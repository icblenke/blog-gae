var db = require("google/appengine/ext/db");

/**
 * A content category
 */
var Category = exports.Category = db.Model("Category", {
	label: new db.StringProperty({required: true}),
	category: new db.ReferenceProperty({referenceClass: Category})
});

Object.defineProperty(Category.prototype, "term", {
    get: function() {
        return this.key().name();
    }
});

Category.prototype.toString = function() {
    return this.term;
}
