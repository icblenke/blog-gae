exports.encode = function(str) {
    return str.replace(/\.{2,}/g, ".");
}
