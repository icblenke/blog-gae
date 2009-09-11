var db = require("google/appengine/ext/db");

var Request = require("nitro/request").Request;

var Tag = require("../../content/tag").Tag;

exports.GET = function(env) {
    var params = new Request(env).params();

    var tags = Tag.all().filter("name >=", params.q).limit(100).fetch();

    res = [];
    for (var i in tags)
        res.push(tags[i].name);
        
    return [200, {}, [res.join("\n")]];
}
