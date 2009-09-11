var db = require("google/appengine/ext/db");

var Paginator = require("nitro/utils/paginator").Paginator;

var Article = require("content/article").Article,
    Category = require("content/category").Category;

var Request = require("nitro/request").Request,
    Response = require("nitro/response").Response;
    
exports.GET = function(env) {
    var params = new Request(env).GET();

    var category = Category.getByKeyName(params.id);
    if (!category) return Response.notFound("Category not found");
    
    var pg = new Paginator(env, 5);
    var articles = Article.all().ancestor(category).order("-created");
    
    return {data: {
        category: category,
        articles: articles.fetch().map(function(a) {
        	return {
        		key: db.keyToString(a.key()),
        		path: a.path(),
        		title: a.title,
        		content: a.content,
        		created: a.created.format("mm/dd/yyyy"),
        		categoryTerm: category.term,
        		categoryLabel: category.label,
        		commentCount: 5,
        		tagString: "hello, world"
        	}
        }),
        paginator: pg.paginate(articles)
    }};
}
