// Customize the Article model.

var Article = require("content/article").Article,
    Taggable = require("content/tag").Taggable;
    
Taggable.extend(Article);
