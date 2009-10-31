var db = require("google/appengine/ext/db");

var Request = require("nitro/request").Request,
    redirect = require("nitro/response").Response.redirect,
    loadTemplate = require("nitro/template").Template.load;

var Article = require("content/article").Article,
    Comment = require("content/comment").Comment,
    markup = require("content/utils").brify;

var Template = require("template").Template,
    template = new Template(system.fs.Path(module.path).resolve("../../templates/comments/comment.inc.html").read());

exports.POST = function(env) {
	var params = new Request(env).params();
	var article = Article.get(params.parentKey);

	var comment = new Comment(article.key(), params.name);
	comment.email = params.email;
	comment.uri = params.uri;
	comment.content = markup(params.content);

	article.updated = new Date();
	article.commentCount = article.commentCount + 1;

    // Save the comment and update the comment count in a single transaction.
    db.runInTransaction(function() {
        db.put([comment, article]);
    });
    	
    if (true) { // FIXME: Check XMLHTTPRequest!
        comment.created = new Date();
        return {body: [template.render({ 
        	content: comment.content,
        	created: comment.created.format("dd/mm/yyyy HH:MM:ss"),
        	gravatarURI: comment.gravatarURI(),
        	authorLink: comment.authorLink()
        })]};
    } else {
        return redirect(request.referrer());
    }
}

