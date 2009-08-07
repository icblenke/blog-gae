var db = require("google/appengine/ext/db");

var Paginator = require("nitro/utils/paginator").Paginator,
	notFound = require("nitro/response").notFound;

var Article = require("../../content/article").Article,
    Category = require("../../content/category").Category;
    
exports.GET = function(env) {
    var params = env.request.params();

    var category = Category.getByKeyName(params.id);
    if (!category) return notFound("Category not found");
    
    var pg = new Paginator(env, 5);
    var articles = Article.all().ancestor(category).order("-created");
    
//    var articles = db.query("SELECT a.*, ca.id AS categoryId, ca.label AS categoryLabel, COUNT(c.parentId) AS commentCount FROM Article a LEFT JOIN Comment c ON a.id=c.parentId LEFT JOIN Category ca ON a.categoryId=ca.id WHERE categoryId=? GROUP BY a.id ORDER BY a.created DESC " + pg.sqlLimit(), id).all(Article).map(function(a) {
//        a.path = a.path();
//        a.tagString = a.tagString_linked();
//        return a;
//    });
//    var category = db.query("SELECT id, label FROM Category WHERE id=?", id).one(Category);

    return {
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
    }
}
