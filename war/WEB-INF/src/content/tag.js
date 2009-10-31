var db = require("google/appengine/ext/db");

var Hash = require("hash").Hash;    

var CLEANUP_RE = /[\!|\.|\(|\)|\[|\]|\{|\}|\?|\&|\@]/g;

var cleanupTagsString = exports.cleanupTagsString = function(str) {
    return str.replace(CLEANUP_RE, "").replace(/, /g, ",").replace(/,$/, ""); // .squeeze(" ")
}

/**
 * A Tag.
 */
var Tag = exports.Tag = db.Model("Tag", {
    count: new db.IntegerProperty({defaultValue: 0})
});

Object.defineProperty(Tag.prototype, "label", {
    get: function() {
        return this.key().name();
    }
});

Tag.prototype.toString = function() {
    return this.key().name();
}

/**
 * Taggable mixin.
 */
var Taggable = exports.Taggable = function() {};

Taggable.extend = function(base) {
    if (!base.kind) throw new TypeError("Taggable can only be mixed into model objects");
    
    base.updateProperties({
        tags: new db.ListProperty()    
    })

    Hash.update(base.prototype, Taggable.prototype);
}

Taggable.prototype.updateTags = function(labels) {
    if (labels) {
        if (typeof(labels) == "string") {
            labels = cleanupTagsString(labels).split(",");
        }
        this.tags = labels.map(function(l) {
            return Tag.getOrInsert(l, {keyName: l}).key().datastoreKey();
        });
    }
}

Taggable.prototype.tagsString = function(sep) {
    return this.tags.map(function(t) {
        return t.name();    
    }).join(sep || ", ");
}

Taggable.prototype.tagsLinks = function(prefix, sep) {
    return this.tags.map(function(t) { 
        return '<a href="' + prefix + t.getName() + '">' + t.getName() + '</a>'; 
    }).join(sep || ", ");
}
