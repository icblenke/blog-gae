var db = require("google/appengine/ext/db");

var Request = require("nitro/request").Request,
    redirect = require("nitro/response").Response.redirect;

var Comment = require("content/comment").Comment,
    Article = require("content/article").Article;
    
exports.DELETE = function(env) {
    var params = new Request(env).params();

    var comment = Comment.get(new db.Key(params.id));
    
    db.runInTransaction(function() {
        var article = comment.parent();
	    article.updated = new Date();
	    article.commentCount = article.commentCount - 1;
	    article.put();     
        comment.remove();
    });

    return redirect("/");
}
