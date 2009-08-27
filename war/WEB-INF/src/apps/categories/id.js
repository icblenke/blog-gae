var db = require("google/appengine/ext/db");

var Paginator = require("nitro/utils/paginator").Paginator,
	notFound = require("nitro/response").notFound;

var Article = require("../../content/article").Article,
    Category = require("../../content/category").Category;

var render = require("nitro/response").render;
    
exports.GET = function(env) {
    var params = env.request.params();

    var category = Category.getByKeyName(params.id);
    if (!category) return notFound("Category not found");
    
    var pg = new Paginator(env, 5);
    var articles = Article.all().ancestor(category).order("-created");
    
    return render({
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
    });
}
