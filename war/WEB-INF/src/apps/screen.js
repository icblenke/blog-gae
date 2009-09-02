// Dynamic generation of the css from a template in src/screen.css
// Mainly to demonstrate what is possible.
exports.GET = function(env) {
    return {
        headers: {
            "Content-Type": "text/css",
            "Cache-Control": "public; max-age=8640000"
        },
        data: {
            gray: "#eee"        
        }
    };
}

