var db = require("google/appengine/ext/db");

var update = require("hash").Hash.update;

var Tag = require("./tag").Tag,
	TagRelation = require("./tag").TagRelation;

var CLEANUP_RX = /[\!|\.|\(|\)|\[|\]|\{|\}|\?|\&|\@]/g;

var tagStringCleanup = function(tagString) {
    return tagString.replace(CLEANUP_RX, "").replace(/, /g, ",").replace(/,$/, ""); // .squeeze(" ")
}

// THINK: add transactions?

/**
 * The Taggable mixin adds tagging functionality to objects.
 */
var Taggable = exports.Taggable = function(base) {
    if (!base.model) throw new TypeError("Taggable can only be mixed into model objects");
    db.copyProperties(base, Taggable.properties);
    update(base.prototype, Taggable.prototype);
};

Taggable.properties = {
    tagString: new db.StringProperty()
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
	var updatedRelations = [];

    var tags = this.tagString.split(",");
    for (var i = 0; i < tags.length; i++) {
    	var tname = tags[i];
    	var tag = Tag.getByKeyName(tname);
    	if (!tag) tag = new Tag(tname);
    	tag.count += 1;
		updatedTags.push(tag);
		var tr = new TagRelation(tag, this);
		tr.created = this.created;
    	updatedRelations.push(tr);
    	
    }

    db.put(updatedTags);
    db.put(updatedRelations);
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
	db.remove(TagRelation.all().ancestor(tag).filter("target =", this.key()).keys());
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
