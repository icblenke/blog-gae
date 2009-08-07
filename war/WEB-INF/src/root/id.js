var db = require("google/appengine/ext/db");

var redirectToReferrer = require("nitro/response").redirectToReferrer,
    notFound = require("nitro/response").notFound;
    
var Article = require("../content/article").Article,
    Comment = require("../content/comment").Comment;
    
exports.GET = function(env) {
    var params = env.request.params();
    var key = params.id.split("/")[0];

    var article = Article.get(db.stringToKey(key));
    if (!article) throw notFound();
    
    var etag = article.updated.format("yymmddHHMMss");

    if (env["HTTP_IF_NONE_MATCH"] == etag) {
        throw [
            304, {
//              "X-Cache": "HIT",
//              "X-Cache-Lookup": "HIT",
                "Cache-Control": "public; must-revalidate",
                "Last-Modified": article.updated.toGMTString(),
                "ETag": etag
            }, 
            ""
        ];
    } else {
		var category = article.parent();

		return [
            200, {
                "Cache-Control": "public; must-revalidate",
                "Last-Modified": article.updated.toGMTString(),
                "ETag": etag
            }, {
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
        ];
    }
}

exports.DELETE = function(env) {
    var params = env.request.GET();
    var key = params.id.split("/")[0];
    db.remove(db.stringToKey(key));
 
    return redirectToReferrer(env);
}
