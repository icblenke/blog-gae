var db = require("google/appengine/ext/db");

/**
 * An image stored in the Datastore.
 */
var Image = exports.Image = function(title) {
    this.title = title;
    this.created = new Date();
    this.__key__ = db.key({kind: this.constructor.kind()});
}

db.Model.extend(Image, "Image", {
    title: new db.StringProperty(),
    type: new db.StringProperty(),
    created: new db.DateTimeProperty(),
    original: new db.BlobProperty(),
    thumbnail: new db.BlobProperty()
});

Image.prototype.toString = function() {
    return "Image {title: " + this.title + ", type: " + this.type + "}"; 
}
