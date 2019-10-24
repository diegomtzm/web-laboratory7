function getAllBlogs() {
    $("#blogPosts").html("");
    fetch("/api/blog-posts")
        .then(res => {
            if(res.ok) {
                return res.json();
            } 
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            for(let i = 0; i < resJSON.length; i++) {
                $("#blogPosts").append(`<li>
                                            <h2> ${resJSON[i].title} </h2>
                                            <p> ${resJSON[i].content} </p>
                                            <p> Author: ${resJSON[i].author} </p>
                                            <p> Published date: ${resJSON[i].publishDate} </p>
                                            <p> ID: ${resJSON[i].id} </p>
                                        </li> <hr>`);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function postBlog(title, content, author, date) {
    let data = {
        title : title,
        content : content,
        author : author,
        publishDate : date 
    }

    let settings = {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch("/api/blog-posts", settings)
        .then(res => {
            if(res.ok) {
                return res.json();
            } 
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            console.log(resJSON);
            $("#newTitle").val("");
            $("#newContent").val("");
            $("#newAuthor").val("");
            $("#newDate").val("");
            $(".postError").css("visibility", "hidden");
        })
        .catch(err => {
            $(".postError").text(err);
            $(".postError").css("visibility", "visible");
            console.log(err);
        });
}

function updateBlog(id, title, content, author, date) {
    let body = {
        id: id,
        title: title != "" ? title : undefined,
        content: content != " " ? content : undefined,
        author: author != "" ? author : undefined,
        publishDate: date != "" ? date : undefined
    }

    let settings = {
        method: "put",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    }

    let url = "/api/blog-posts/" + id;

    fetch(url, settings)
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            console.log(resJSON);
            $("#updateId").val("");
            $("#updateTitle").val("");
            $("#updateContent").val("");
            $("#updateAuthor").val("");
            $("#updateDate").val("");
            $(".putError").css("visibility", "hidden");
        })
        .catch(err => {
            $(".putError").text(err);
            $(".putError").css("visibility", "visible");
            console.log(err);
        })
}

function deleteBlog(id) {
    let settings = {
        method : "delete"
    }
    
    let url = "/api/blog-posts/" + id;

    fetch(url, settings)
        .then(res => {
            if(res.ok){
                return res.json();
            }
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            console.log(resJSON);
            $("#deleteId").val("");
            $(".deleteError").css("visibility", "hidden");
        })
        .catch(err => {
            $(".deleteError").text(err);
            $(".deleteError").css("visibility", "visible");
            console.log(err);
        })
}

function init() {

    getAllBlogs();

    $("#postForm").on("submit", function(e) {
        e.preventDefault();
    
        let newTitle = $("#newTitle").val();
        let newContent = $("#newContent").val();
        let newAuthor = $("#newAuthor").val();
        let newDate = $("#newDate").val();
        
        postBlog(newTitle, newContent, newAuthor, newDate);
        getAllBlogs();
    });

    $("#putForm").on("submit", function(e) {
        e.preventDefault();

        let updId = $("#updateId").val();
        let updTitle = $("#updateTitle").val();
        let updContent = $("#updateContent").val();
        let updAuthor = $("#updateAuthor").val();
        let updDate = $("#updateDate").val();

        updateBlog(updId, updTitle, updContent, updAuthor, updDate);
        getAllBlogs();
    });

    $("#deleteForm").on("submit", function(e) {
        e.preventDefault();

        let deleteId = $("#deleteId").val();

        deleteBlog(deleteId);
        getAllBlogs();
    });
}

init();
