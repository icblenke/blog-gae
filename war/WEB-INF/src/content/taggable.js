var db = require("google/appengine/ext/db");

var Tag = require("./tag").Tag;

var CLEANUP_RX = /[\!|\.|\(|\)|\[|\]|\{|\}|\?|\&|\@]/g;

var tagStringCleanup = function(tagString) {
    return tagString.replace(CLEANUP_RX, "").replace(/, /g, ",").replace(/,$/, ""); // .squeeze(" ")
}

/**
 * The Taggable mixin adds tagging functionality to objects.
 */
var Taggable = exports.Taggable = function() {};

Taggable.included = function(base) {
	base.Model.properties.tagString = new db.StringProperty();
	Object.include(base.prototype, Taggable.prototype);
}

/**
 * Apply the given tagString to the object.
 * WARNING: Does not save the object. 
 */
Taggable.prototype.updateTags = function(tagString) {
    if (!tagString) return;
    
    this.removeTags();
    this.tagString = tagStringCleanup(tagString);

	var updatedTags = [];

    var tags = this.tagString.split(",");
    for (var i = 0; i < tags.length; i++) {
    	var tname = tags[i];
    	var tag = Tag.getByKeyName(tname);
    	if (!tag) tag = new Tag(tname);
    	tag.count += 1;
		updatedTags.push(tag);
    }

    db.put(updatedTags);
}

/**
 * Remove all tags.
 * WARNING: Does not save the object. 
 */
Taggable.prototype.removeTags = function() {
	if (!this.tagString) return;

	var updatedTags = [];
	
	var tags = this.tagString.split(",");
	for (i = 0; i < tags.length; i++) {
		var tag = Tag.getByKeyName(tags[i]);
		if (tag) {
			tag.count -= 1;
			if (tag.count < 0) tag.count = 0;
			updatedTags.push(tag);
		}
	}

	db.put(updatedTags);
}

/**
 * Build a linked version of the tagstring.
 */
Taggable.prototype.tagString_linked = function() {
   if (!this.tagString) return "";

   return this.tagString.split(",").map(function(t) {
	   return '<a href="/tags/*' + encodeURIComponent(t) + '">' + t + '</a>'
   }).join(", ");
}
