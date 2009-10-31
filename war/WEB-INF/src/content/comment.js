var db = require("google/appengine/ext/db");

var Gravatar = require("../gravatar").Gravatar;

var VALID_EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

/**
 * An unclaimed comment.
 */
var Comment = exports.Comment = db.Model("Comment", {
	authorName: new db.StringProperty({required: true}),
	authorEmail: new db.EmailProperty(),
	authorUri: new db.StringProperty(),
	content: new db.TextProperty({required: true}),
	created: new db.DateProperty({autoNowAdd: true})
});

Gravatar.extend(Comment);

Comment.prototype.authorLink = function() {
    return '<a href="' + this.authorUri + '" rel="nofollow">' + this.authorName + '</a>';
}

Comment.validate = function(obj) {
    var errors = {};
    
    if ((!obj.name) || (obj.name.length < 3)) {
        errors.name = "Invalid author name";
    }
    
	if (!VALID_EMAIL_RE.test(obj.email)) {
		errors.email = "Invalid author email";
	} 
	
	return errors;
}
