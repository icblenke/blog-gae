var db = require("google/appengine/ext/db");

var update = require("hash").Hash.update,
    crc32 = require("crc32").hash;

var response = require("nitro/response"),
    redirect = response.redirect,
    notFound = response.notFound,
    notModified = response.notModified,
    render = response.render;
        
var Article = require("../content/article").Article,
    Comment = require("../content/comment").Comment;
    
exports.GET = function(env) {
    var params = env.request.params();
    var key = params.id.split("/")[0];

    var article = Article.get(db.stringToKey(key));
    if (!article) throw response.notFound("Article not found");
    
    var etag = crc32(article.updated.toString()).toString();


    if (env["HTTP_IF_NONE_MATCH"] == etag) {
        return notModified();        
    } else {
		var category = article.parent();

        var response = render({
            article: {
            	key: db.keyToString(article.key()),
        		title: article.title,
            	content: article.content,
            	created: article.created.format("mm/dd/yyyy"),
            	categoryTerm: category.term,
            	categoryLabel: category.label,
	            comments: Comment.all().ancestor(article).fetch().map(function(c) {
	            	return {
	            	    key: db.keyToString(c.key()),
		            	content: c.content,
		            	created: c.created.format("dd/mm/yyyy HH:MM:ss"),
		            	gravatarURI: c.gravatarURI(),
		            	authorLink: c.authorLink()
	            	}
	            }),
            	commentCount: article.commentCount,
            	tagString: article.tagString_linked()
            }
        });

        update(response[1], {
            "Cache-Control": "public; must-revalidate",
            "Last-Modified": article.updated.toGMTString(),
            "ETag": etag
        })

        return response;
    }
}

exports.DELETE = function(env) {
    var params = env.request.GET();
    var key = params.id.split("/")[0];
    db.remove(db.stringToKey(key));
 
    return redirect(env.request.referrer());
}
