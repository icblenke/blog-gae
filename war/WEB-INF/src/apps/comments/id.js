var db = require("google/appengine/ext/db");

var redirect = require("jack/response").Response.redirect;

var Comment = require("content/comment").Comment,
    Article = require("content/article").Article;
    
exports.DELETE = function(env) {
    var params = env.request.GET();

    var comment = Comment.get(db.stringToKey(params.id));
    
    db.runInTransaction(function() {
        var article = comment.parent();
	    article.updated = new Date();
	    article.commentCount = article.commentCount - 1;
	    article.put();     
        comment.remove();
    });

    return redirect("/");
}
