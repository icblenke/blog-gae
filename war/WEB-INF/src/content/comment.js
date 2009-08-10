var crc32 = require("crc32").hash;

var db = require("google/appengine/ext/db");

var Gravatar = require("../users/gravatar").Gravatar;

var VALID_EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

/**
 * An unclaimed comment.
 */
var Comment = exports.Comment = function(parentKey, name) {
	this.name = name;
	this.created = new Date();
	var keyName = "c" + crc32(name + this.created.getTime());
	this.setKey(db.key(parentKey, "Comment", keyName));
}

db.model(Comment, "Comment", {
	name: new db.StringProperty(),
	email: new db.EmailProperty(),
	uri: new db.StringProperty(),
	content: new db.TextProperty(),
	created: new db.DateProperty()
});

Gravatar(Comment);

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
