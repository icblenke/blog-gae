var Article = require("content/article").Article,
    Category = require("content/category").Category;

var Request = require("nitro/request").Request,
    Response = require("nitro/request").Response;

exports.GET = function(env) {
    var params = new Request(env).params();
    
    var article;
    var categories = Category.all();
    
    if (params.id) {
    	article = Article.get(params.id);
    	if (!article) return Response.notFound("Article not found");
    } else {
        article = new Article();
    }
    
    var response =  {data: {
        title: article.id ? ("Edit '"+article.title+"'") : "New article",
        article: article,
        categories: categories.fetch().map(function(c) {
        	return {
        		key: c.key(), 
        		label: c.label
        	}
        })
    }};
    
    if (params.id) response.data.key = article.key();
    
    return response;
}
