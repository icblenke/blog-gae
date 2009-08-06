var db = require("google/appengine/ext/db");

var notFound = require("nitro/response").notFound,
    redirect = require("nitro/response").redirect;
    
var Article = require("content/article").Article,
	Category = require("content/category").Category,
    markup = require("content/markup").markup;

exports.POST = function(env) {
    var params = env.request.params();
    
    var article;
    
    if (params.key) { // Update an existing object.
    	article = Article.get(db.stringtoKey(params.key));
    } else { // Insert a new object.
    	var category = Category.get(db.stringToKey(params.categoryKey));
    	if (!category) return notFound("Category not found");
        article = new Article(category.key(), params.title);
    }

    article.content = markup(params.content);
    article.created = article.updated = new Date();
    article.updateTags(params.tagString);
    db.put(article);
    
	return redirect("/");
}

