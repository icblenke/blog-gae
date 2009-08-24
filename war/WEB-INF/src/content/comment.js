var crc32 = require("crc32").hash;

var db = require("google/appengine/ext/db");

var Gravatar = require("../users/gravatar").Gravatar;

var VALID_EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

/**
 * An unclaimed comment.
 */
var Comment = exports.Comment = function(parentOrKey, content) {
    this.content = content;
	this.created = new Date();
	this.parentKey = db.resolveKey(parentOrKey);
	this.__key__ = Comment.key(this);
}

Comment.model = new db.Model(Comment, "Comment", {
	name: new db.StringProperty(),
	email: new db.EmailProperty(),
	uri: new db.StringProperty(),
	content: new db.TextProperty(),
	created: new db.DateProperty()
});

Comment.key = function(obj) {
	return db.key(obj.parentKey, "Comment", "c" + crc32(obj.name + obj.created.getTime()));
}

Comment.prototype.authorLink = function() {
    return '<a href="' + this.uri + '" rel="nofollow">' + this.name + '</a>';
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

Gravatar(Comment);
