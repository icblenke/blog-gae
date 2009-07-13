var md5 = require("md5").hash;

/**
 * Generate the gravatar uri.
 * Examples: 
 *   "http://gravatar.com/e9e719b44653a9300e1567f09f6b2e9e.png?r=PG&s=512"
 *   "https://secure.gravatar.com/e9e719b44653a9300e1567f09f6b2e9e.png?r=PG"
 */
var gravatarUri = exports.uri = function(email, extra, prefix) {
    if (!email) return "";
    return "http://gravatar.com/avatar/" + md5(email) + ".png" + (extra || "");
}

/**
* A gravatar, or globally recognized avatar, is quite simply an avatar 
* image that follows you from weblog to weblog appearing beside your 
* name when you comment on gravatar enabled sites. Avatars help 
* identify your posts on web forums, so why not on weblogs?
*
* http://www.gravatar.com
*/
var Gravatar = exports.Gravatar = function() {};

Gravatar.prototype.gravatarURI = function() {
    return gravatarUri(this.email);
}

Gravatar.prototype.gravatarURI_small = function() {
    return gravatarUri(this.email, "?s=32");
}
