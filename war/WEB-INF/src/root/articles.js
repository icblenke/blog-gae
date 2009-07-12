var db = require("google/appengine/ext/db");

var NotFound = require("nitro/exceptions").NotFound,
	Response = require("nitro/response").Response;


var Article = require("content/article").Article,
	Category = require("content/category").Category,
    markup = require("content/markup").markup;

exports.POST = function(env) {
    var params = env.request.params();
    
    var article;
    
    if (params.key) { // Update an existing object. 
        db.execute(
            "UPDATE Article SET title=?, content=?, categoryId=? WHERE id=?",
            params.title, markup(params.content), params.categoryId, params.id
        );
    } else { // Insert a new object.
    	var category = Category.get(db.stringToKey(params.categoryKey));
    	if (!category) throw NotFound("Category not found");
    
        article = new Article(category.key(), params.title);
        article.content = markup(params.content);
        article.created = article.updated = new Date();
        db.put(article);
    }        

//    article.updateTags(params.tagString);
    
	return Response.redirect("/");
}

