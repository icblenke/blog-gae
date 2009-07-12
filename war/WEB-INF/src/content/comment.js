var db = require("google/appengine/ext/db");

var Gravatar = require("../users/gravatar").Gravatar;

var VALID_EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

/**
 * An unclaimed comment.
 *
 * authorName
 * authorEmail
 * authorURI
 * content
 * created
 * parentId
 */
var Comment = exports.Comment = function(parentKey) {
	this.setKey(db.key(parentKey, "Comment"));
}

//Object.include(Comment, Gravatar);

db.model(Comment, "Comment", {
	name: new db.StringProperty(),
	email: new db.EmailProperty(),
	uri: new db.StringProperty(),
	content: new db.TextProperty(),
	created: new db.DateProperty()
});

Comment.prototype.authorLink = function() {
    return '<a href="' + this.uri + '" rel="nofollow">' + this.name + '</a>';
}

Comment.validate = function(obj) {
    var errors = {};
    
    if ((!obj.authorName) || (obj.name.length < 3)) {
        errors.authorName = "Invalid author name";
    }
    
	if (!VALID_EMAIL_RE.test(obj.authorEmail)) {
		errors.authorEmail = "Invalid author email";
	} 
	
	return errors;
}
