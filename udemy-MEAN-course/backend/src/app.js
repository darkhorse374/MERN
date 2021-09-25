const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//     console.log('Server started');
//     next();
// });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post was successfuly saved'
    });
});

app.use('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: 'f0afw3423',
            title: 'Demo Post',
            content: 'Demo post retrieved from backend'
        },
        {
            id: 'f0afw8564',
            title: 'Another Post',
            content: 'Another demo post retrieved from backend'
        }
    ];
    res.status(200).json({
        message: 'Posts data',
        posts: posts
    });
    // res.send('Hello from express!');
});

module.exports = app;