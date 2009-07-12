var NotFound = require("nitro/exceptions").NotFound;

var db = require("google/appengine/ext/db");

var Article = require("../content/article").Article,
    Comment = require("../content/comment").Comment;
    
exports.GET= function(env) {
    var params = env.request.params();
    var key = params.id.split("/")[0];

//    var article = db.query("SELECT a.*, ca.id AS categoryId, ca.label AS categoryLabel FROM Article a LEFT JOIN Category ca ON a.categoryId=ca.id WHERE a.id=?", id).one(Article);
//
    var article = Article.get(db.stringToKey(key));
    if (!article) throw NotFound();
    
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
//        article.comments = db.query("SELECT * FROM Comment WHERE parentId=?", id).all(Comment).map(function(c) {
//            c.gravatarURI = c.gravatarURI();
//            c.authorLink = c.authorLink();
//            return c;
//        });
//        article.commentCount = 3 // article.comments.length;
//        article.metaKeywords = article.tagString ;
		var category = article.parent();

		return [
            200, {
                "Cache-Control": "public; must-revalidate",
                "Last-Modified": article.updated.toGMTString(),
                "ETag": etag
            }, {
	            article: {
	            	title: article.title,
	            	content: article.content,
	            	created: article.created.format("mm/dd/yyyy"),
	            	categoryTerm: category.term,
	            	categoryLabel: category.label,
		            comments: [],
	            	commentCount: 0,
	            	tagString: "hello, world"
	            }
            }
        ];
    }
}

exports.DELETE = function(env) {
    var params = env.request.params();
    var id = params.id.split("/")[0];
    
    db.execute("DELETE FROM Article WHERE id=?", id);

    env.request.redirect();
}
