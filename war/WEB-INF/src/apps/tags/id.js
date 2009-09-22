var db = require("google/appengine/ext/db");

var Paginator = require("nitro/utils/paginator").Paginator;
	
var Request = require("nitro/request").Request,
    Response = require("nitro/response").Response;

var Article = require("content/article").Article,
    Category = require("content/category").Category,
    Tag = require("content/tag").Tag,
    TagRelation = require("content/tag").TagRelation;
    
exports.GET = function(env) {
    var params = new Request(env).params();

    var tag = Tag.getByKeyName(params.id);
    if (!tag) return Response.notFound("Tag not found");    
    
    var pg = new Paginator(env, 5);
    var articleKeys = pg.limitQuery(TagRelation.all()).ancestor(tag).order("-created").fetch().map(function(tr) {
        return tr.target;
    });
    
    var articles = db.get(articleKeys).map(function(a) {
		var category = Category.get(a.category);
    	return {
    		key: a.key().toString(),
    		path: a.path(),
    		title: a.title,
    		content: a.content,
    		created: a.created.format("mm/dd/yyyy"),
    		categoryTerm: category.term,
    		categoryLabel: category.label,
    		commentCount: a.commentCount,
    		tagString: a.tagString_linked()
    	}
    });

	return {data: {
        tag: tag,
        articles: articles,
        paginator: pg.paginate(articles)
    }};    
}
