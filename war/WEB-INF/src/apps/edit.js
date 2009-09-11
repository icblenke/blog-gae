var db = require("google/appengine/ext/db");

var Article = require("content/article").Article,
    Category = require("content/category").Category;

var Request = require("nitro/request").Request,
    Response = require("nitro/request").Response;

exports.GET = function(env) {
    var params = new Request(env).params();
    
    var article;
    var categories = Category.all();
    
    if (params.id) {
    	article = Article.get(db.stringToKey(params.id));
    	if (!article) return Response.notFound("Article not found");
    } else {
        article = new Article();
    }
    
    var response =  {data: {
        title: article.id ? ("Edit '"+article.title+"'") : "New article",
        article: article,
        categories: categories.fetch().map(function(c) {
        	return {
        		key: db.keyToString(c.key()), 
        		label: c.label
        	}
        })
    }};
    
    if (params.id) response.data.key = db.keyToString(article.key());
    
    return response;
}
