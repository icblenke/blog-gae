var db = require("google/appengine/ext/db");

/**
 * An image stored in the Datastore.
 */
var Image = exports.Image = db.Model("Image", {
    title: new db.StringProperty(),
    type: new db.StringProperty({defaultValue: "image/png"}),
    created: new db.DateTimeProperty({autoNowAdd: true}),
    original: new db.BlobProperty(),
    thumbnail: new db.BlobProperty()
});

Image.prototype.toString = function() {
    return "{title: " + this.title + ", type: " + this.type + "}"; 
}
