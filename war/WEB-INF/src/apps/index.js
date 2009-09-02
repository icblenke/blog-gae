var db = require("google/appengine/ext/db");

var Paginator = require("nitro/utils/paginator").Paginator,
    encode = require("nitro/utils/atom").encode;

var Article = require("../content/article").Article,
    Category = require("../content/category").Category;

exports.GET = function(env) {
    if ("/index.atom" == env["PATH_INFO"]) {
        var articles = Article.all().order("-created").limit(10).fetch();

        var base = "http://" + env["SERVER_NAME"] + (env["SERVER_PORT"] == "80" ? "" : ":" + env["SERVER_PORT"]);
        
        return {status: 200, headers: {"Content-Type": "text/atom"}, body: [encode(articles, {
		    title: "Blog example",
		    base: base,
		    self: base+ "/index.atom",
		    updated: articles[0].created
	    })]};
    } else {
    	var pg = new Paginator(env, 5);
    	var articles = pg.limitQuery(Article.all().order("-created")).fetch().map(function(a) {
    		var category = Category.get(a.category);
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

    	return {data: {
            articles: articles,
            paginator: pg.paginate(articles)
        }};
    }
}
