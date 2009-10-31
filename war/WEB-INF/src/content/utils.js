/**
 * Create a title slug.
 */
// Something like this is better: return re.sub('[^a-zA-Z0-9-]+', '-', s).strip('-'),
// use squeeze/strip.
exports.slugify = function(str) {
    return str.replace(/ |%|!|\(|\)|\*|\[|\]|\$|#|\?|\;|\&|=|@|\./g, "-").replace(/-{2,}/g, "-").replace(/^-/, "").replace(/-$/, "");
}
    
exports.nofollowify = function(str) {
    return str;
}

exports.brify = function(src) {
    return src.replace(/\n/g, "<br />");
}
