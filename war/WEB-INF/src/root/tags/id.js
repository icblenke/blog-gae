var db = require("google/appengine/ext/db");

var Paginator = require("nitro/utils/paginator").Paginator;
	
var response = require("nitro/response"),
    render = response.render,
    notFound = response.notFound;

var Article = require("../../content/article").Article,
    Tag = require("../../content/tag").Tag,
    TagRelation = require("../../content/tag").TagRelation;
    
exports.GET = function(env) {
    var params = env.request.GET();

    var tag = Tag.getByKeyName(params.id);
    if (!tag) return notFound("Tag not found");    
    
	var pg = new Paginator(env, 5);
    var articleKeys = pg.limitQuery(TagRelation.all()).ancestor(tag).order("-created").fetch().map(function(tr) {
    	return tr.target;
    });
    var articles = db.get(articleKeys).map(function(a) {
		var category = a.parent();
    	return {
    		key: db.keyToString(a.key()),
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

	return render({
        tag: tag,
        articles: articles,
        paginator: pg.paginate(articles)
    });    
}
