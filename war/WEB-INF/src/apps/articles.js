var db = require("google/appengine/ext/db");

var Request = require("nitro/request").Request,
    redirect = require("nitro/response").Response.redirect;

var Article = require("content/article").Article,
    Category = require("content/category").Category,
    markup = require("content/markup").markup;

exports.POST = function(env) {
    var params = new Request(env).params();
    
    var article;
    
    if (params.key) { // Update an existing object.
    	article = Article.get(params.key);
    } else { // Insert a new object.
        article = new Article(params.title);
    }

    article.title = params.title;
    article.category = new db.Key(params.categoryKey);
    article.content = markup(params.content);
    article.created = article.updated = new Date();
    article.updateTags(params.tagString);
    article.put();
    
    return redirect("/");
}

