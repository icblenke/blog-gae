var db = require("google/appengine/ext/db");

var NotFound = require("nitro/exceptions").NotFound,
    redirect = require("nitro/response").redirectResponse;
    
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
    	if (!category) throw NotFound("Category not found");
        article = new Article(category.key(), params.title);
    }

    article.content = markup(params.content);
    article.created = article.updated = new Date();
    article.updateTags(params.tagString);
    db.put(article);
    
	return redirect("/");
}

