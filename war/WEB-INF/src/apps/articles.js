var db = require("google/appengine/ext/db");

var redirect = require("nitro/response").Response.redirect;

var Article = require("content/article").Article,
    Category = require("content/category").Category,
    markup = require("content/markup").markup;

exports.POST = function(env) {
    var params = env.request.params();
    
    var article;
    
    if (params.key) { // Update an existing object.
    	article = Article.get(db.stringtoKey(params.key));
    } else { // Insert a new object.
        article = new Article(params.title);
    }

    article.title = params.title;
    article.category = db.stringToKey(params.categoryKey);
    article.content = markup(params.content);
    article.created = article.updated = new Date();
    article.updateTags(params.tagString);
    db.put(article);
    
    return redirect("/");
}

