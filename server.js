let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let uuidv4 = require('uuid/v4');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(morgan("dev"));

var posts = [{
    id : uuidv4(),
    title : "Post1",
    content : "Content1",
    author : "DiegoMtzM",
    publishDate : new Date(2014, 8, 14)
},
{
    id : uuidv4(),
    title : "Post2",
    content : "Content2",
    author : "DiegoMtzM",
    publishDate : new Date(2016, 11, 3)
},
{
    id : uuidv4(),
    title : "Post3",
    content : "Content3",
    author : "Sofía Juarez",
    publishDate : new Date(2018, 10, 25)
}];

function getFromAuthor(author) {
    let found = false;
    let postsIndexes = [];
    
    posts.forEach((p, idx) => {
        if (p.author == author) {
            found = true;
            postsIndexes.push(idx);
        }
    });

    return {found: found, indexes: postsIndexes};
}

function findId(id) {
    let index = -1;

    posts.forEach((p, idx) => {
        if (p.id == id) {
            index = idx;
        }
    })
    return index;
}

app.get("/api/blog-posts", (req, res) => {
    return res.status(200).json(posts);
});

app.get("/api/blog-post", (req, res) => {
    let author = req.query.author;
    if(!author) {
        res.statusMessage = "Missing author field in query";
        return res.status(406).json({message: "Missing author field in query", status: 406});
    } 
    
    let {found, indexes} = getFromAuthor(author);
    if(found) {
        let results = [];
        indexes.forEach(i => {
            results.push(posts[i]);
        });
        return res.status(200).json(results);
    } else {
        res.statusMessage = "Author not found";
        return res.status(404).json({message: "Author not found", status: 404});
    }
});

app.post("/api/blog-posts", jsonParser, (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;

    if(!title || !content || !author || !date) {
        res.statusMessage = "Missing field in body";
        return res.status(406).json({message: "Missing field in body", status: 406});
    } else {
        let newPost = {
            id : uuidv4(),
            title : title,
            content : content,
            author : author,
            publishDate : date
        };
        posts.push(newPost);
        return res.status(201).json(newPost);
    }
});

app.delete("/api/blog-posts/:id", (req, res) => {
    let reqId = req.params.id;

    let index = findId(reqId);
    if(index >= 0) {
        posts.splice(index,1);
        return res.status(200).json({message: "Post deleted correctly", status: 200});
    } else {
        res.statusMessage = "Id not found";
        return res.status(404).json({message: "Id not found", status: 404});
    }
});

app.put("/api/blog-posts/:id", jsonParser, (req, res) => {
    console.log(req.body);
    let bodyId = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;
    let paramsId = req.params.id;

    if (!bodyId) {
        res.statusMessage = "Missing id field in body";
        return res.status(406).json({message: "Missing id field in body", status: 406});
    }

    if (paramsId != bodyId) {
        res.statusMessage = "Body and params Id do not match";
        return res.status(409).json({message: "Body and params Id do not match", status: 409});
    }

    let index = findId(bodyId);
    if(index < 0) {
        res.statusMessage = "Id not found";
        return res.status(404).json({message: "Id not found", status: 404});
    }

    posts[index].title = title ? title : posts[index].title;
    posts[index].content = content ? content : posts[index].content;
    posts[index].author = author ? author : posts[index].author;
    posts[index].publishDate = date ? date : posts[index].publishDate;

    let updatedPost = posts[index];
    return res.status(202).json(updatedPost);
});


app.listen("8080", () => {
    console.log("App is running on port 8080");
});