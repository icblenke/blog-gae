var Request = require("nitro/request").Request,
    Response = require("nitro/response").Response;

var Article = require("content/article").Article,
    Category = require("content/category").Category,
    Tag = require("content/tag").Tag;

var paginate = require("paging").paginateByKey;
    
exports.GET = function(env) {
    var params = new Request(env).params();
    
    var tag = Tag.getByKeyName(params.id);
    if (!tag) return Response.notFound("Tag not found");        

    var page = paginate(Article.all().filter("tags =", tag.key().datastoreKey()), params.pb, 10);
   
    return {data: {
        tag: tag,
        articles: page.items.map(function(a) {
        	return {
        		key: a.key(),
        		path: a.path(),
        		title: a.title,
        		content: a.content,
        		created: a.created,
        		category: Category.get(a.category),
        		commentCount: a.commentCount,
        		tagsLinks: a.tagsLinks("/tags/*")
        	}
        }),
        page: page.controls("/tags/*" + tag.label + "?pb=")
    }};
}
