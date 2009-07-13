var db = require("google/appengine/ext/db");

var Paginator = require("nitro/utils/paginator").Paginator,
    encode = require("nitro/utils/atom").encode;

var Article = require("../content/article").Article,
    Category = require("../content/category").Category;

exports.GET = function(env) {
    if ("application/atom+xml" == env["CONTENT_TYPE"]) {
/*    	
        var articles = db.query("SELECT * FROM Article ORDER BY created DESC LIMIT 10").all(Article);

        return encode(articles, {
		    title: "Blog example",
		    base: "http://localhost:8080",
		    self: "http://localhost:8080/index.atom",
		    updated: articles[0].created
	    });
*/	        
    } else {
//      var pg = new Paginator(env, 5);
//      var articles = Article.all().offset(pg.offset).limit(5).fetch().map(function(a) {
    	var articles = Article.all().order("-created").fetch().map(function(a) {
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
        		tagString: "hello, world"
        	}
        });
/*        
        var articles = db.query("SELECT a.*, ca.id AS categoryId, ca.label AS categoryLabel, COUNT(c.parentId) AS commentCount FROM Article a LEFT JOIN Comment c ON a.id=c.parentId LEFT JOIN Category ca ON a.categoryId=ca.id GROUP BY a.id ORDER BY a.created DESC " + pg.sqlLimit()).all(Article).map(function(a) {
            a.path = a.path();
            a.tagString = a.tagString_linked();
            return a;
        });
*/
        return {
            articles: articles //,
//            paginator: pg.paginate(articles)
        };
    }
}

