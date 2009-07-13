var db = require("google/appengine/ext/db");

var Tag = require("../../content/tag").Tag;

exports.GET = function(env) {
    var params = env.request.params();

    var tags = Tag.all().filter("name >=", params.q).limit(100).fetch();

    res = [];
    for (var i in tags)
        res.push(tags[i].name);
        
    return [200, {}, [res.join("\n")]];
}
