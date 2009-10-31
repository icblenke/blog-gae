var db = require("google/appengine/ext/db");

var crc32 = require("crc32").hash;

var Request = require("nitro/request").Request,
    Response = require("nitro/response").Response;

var Article = require("content/article").Article,
    Category = require("content/category").Category,
    Comment = require("content/comment").Comment;
    
exports.GET = function(env) {
    var params = new Request(env).params(),
        key = params.id.split("/")[0];

    var article = Article.get(new db.Key(key));
    if (!article) throw Response.notFound("Article not found");
    
    var etag = crc32(article.updated.toString()).toString();

    if (env["HTTP_IF_NONE_MATCH"] == etag) {
        return Response.notModified();        
    } else {
    	var category = Category.get(article.category);

        return {
            headers: {
                "Cache-Control": "public; must-revalidate",
                "Last-Modified": article.updated.toGMTString(),
                "ETag": etag
            }, 
            data: {
                article: {
                	key: article.key().toString(),
            		title: article.title,
                	content: article.content,
                	created: article.created,
                	category: category,
	                comments: Comment.all().ancestor(article).fetch().map(function(c) {
	                	return {
	                	    key: c.key().toString(),
		                	content: c.content,
		                	created: c.created,
		                	gravatarURI: c.gravatarURI(),
		                	authorLink: c.authorLink()
	                	}
	                }),
                	commentCount: article.commentCount,
                	tagsLinks: article.tagsLinks("/tags/*")
                }
            }
        }
    }
}

exports.DELETE = function(env) {
    var request = new Request(env),
        params = request.params();

    var key = params.id.split("/")[0];

    db.remove(new db.Key(key));
 
    return Response.redirect(request.referrer());
}
