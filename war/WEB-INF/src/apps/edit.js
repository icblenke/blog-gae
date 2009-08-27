var db = require("google/appengine/ext/db");

var Article = require("content/article").Article,
    Category = require("content/category").Category;

var render = require("nitro/response").render;

exports.GET = function(env) {
    var params = env.request.params();
    
    var article;
    var categories = Category.all();
    
    if (params.id) {
    	article = Article.get(db.stringToKey(params.id));
    	if (!article) throw NotForund("Article not found");
    } else {
        article = new Article();
    }
    
    var response =  render({
        title: article.id ? ("Edit '"+article.title+"'") : "New article",
        article: article,
        categories: categories.fetch().map(function(c) {
        	return {
        		key: db.keyToString(c.key()), 
        		label: c.label
        	}
        })
    });
    
    if (params.id) response.key = db.keyToString(article.key());
    
    return response;
}
