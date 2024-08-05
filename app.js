const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { log } = require('console');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) throw err;
        res.render('index', { files: files });
        // console.log(files);
    });

});
app.get('/create', (req, res) => {
    res.render('create');
});
app.get('/read/:file', (req, res,) => {
    fs.readFile(`./files/${req.params.file}`, 'utf-8', (err,file) => {
        res.render('read', { file, filename: req.params.file });
    });
});
app.get('/edit/:file', (req, res) => {
    fs.readFile(`./files/${req.params.file}`, 'utf-8', (err, file) => {
        res.render('edit', { file: file , filename: req.params.file });
    });
});
app.post('/create', (req, res) => {
    if(req.body.title && req.body.dets != "") {
        fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`, JSON.stringify(req.body.dets), {flag: 'a'},(err) => {
            if (err) return err;
            res.redirect('/');
        });
    }else{
        res.send('Error: Title and details are required. Please try again. You can use the previous page to fill in the form again.');
    }
});
app.post('/update/:file', (req, res) => {
    fs.writeFile(`./files/${req.params.file}`, req.body.dets,    (err) => {
        if(err) return err;
        res.redirect('/');
    })
});
app.listen(3000);