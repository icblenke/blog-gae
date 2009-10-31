var Request = require("nitro/request").Request;

var encode = require("nitro/utils/atom").encode;

var Article = require("content/article").Article,
    Category = require("content/category").Category;

var paginate = require("paging").paginateByKey;

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
        var params = new Request(env).params();
        var page = paginate(Article.all().order("-created"), params.pb, 10);    	
       
    	return {data: {
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
            page: page.controls("?pb=")
        }};
    }
}
