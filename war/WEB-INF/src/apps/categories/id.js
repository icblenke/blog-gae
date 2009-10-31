var Article = require("content/article").Article,
    Category = require("content/category").Category;

var Request = require("nitro/request").Request,
    Response = require("nitro/response").Response;

var paginate = require("paging").paginateByKey;
    
exports.GET = function(env) {
    var params = new Request(env).params();

    var category = Category.getByKeyName(params.id);
    if (!category) return Response.notFound("Category not found");

    var page = paginate(Article.all().filter("category =", category).order("-created"), params.pb, 10);    	    
    
    return {data: {
        category: category,
        articles: page.items.map(function(a) {
        	return {
        		key: a.key(),
        		path: a.path(),
        		title: a.title,
        		content: a.content,
        		created: a.created,
        		category: category,
        		commentCount: a.commentCount,
        		tagsLinks: a.tagsLinks("/tags/*")
        	}
        }),
        page: page.controls("/categories/*" + category.term + "?pb=")
    }};
}
