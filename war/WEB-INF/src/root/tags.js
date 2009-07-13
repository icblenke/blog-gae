var db = require("google/appengine/ext/db");

var NotFound = require("nitro/exceptions").NotFound;

var Tag = require("../content/tag").Tag;

exports.GET = function(env) {
    var tags = Tag.all().order("-count").limit(100).fetch();
    
    if (tags.length > 0) {
        var size, maxSize = 0;
        var maxCount = Number(tags[0].count);

        // The tags of the tagcloud are alphabetically sorted for convenience.
        // Cannot use multiple columns in ORDER BY to achieve the same effect.
        tags = tags.sort();

        var t, cloud = [];
        
        for (var i in tags) {
            t = tags[i];
            size = (Number(t.count) / maxCount) * 5;
            if (size > maxSize) maxSize = size;
            cloud.push('<a href="/tags/*' + t.name + '" style="font-size: ' + size + 'em">' + t.name + '</a>');
        }
        
        return {
            windowTitle: "Tags",
            tags: cloud.join(" "),
            maxSize: maxSize
        }
    } else
        return NotFound("No tags found");
}
