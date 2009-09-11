var db = require("google/appengine/ext/db");

var crc32 = require("crc32").hash;

var Request = require("nitro/request").Request,
    Response = require("nitro/response").Response;

var Article = require("content/article").Article,
    Comment = require("content/comment").Comment;
    
exports.GET = function(env) {
    var params = new Request(env).GET();
    var key = params.id.split("/")[0];

    var article = Article.get(db.stringToKey(key));
    if (!article) throw Response.notFound("Article not found");
    
    var etag = crc32(article.updated.toString()).toString();

    if (env["HTTP_IF_NONE_MATCH"] == etag) {
        return Response.notModified();        
    } else {
	var category = article.parent();

        return {
            headers: {
                "Cache-Control": "public; must-revalidate",
                "Last-Modified": article.updated.toGMTString(),
                "ETag": etag
            }, 
            data: {
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
            }
        }
    }
}

exports.DELETE = function(env) {
    var params = env.request.GET();
    var key = params.id.split("/")[0];
    db.remove(db.stringToKey(key));
 
    return Response.redirect(env.request.referrer());
}
