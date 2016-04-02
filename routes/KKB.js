
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var multer = require("multer");
var file = require('file-type');
var userschema = schema({
    ID : String,
    PW : String,
    NAME : String,
    OLD : String,
    PHONE : String
});
var boardschema = schema({
    ID : String,
    CREATER : String,
    TIME : String,
    TEXT : String,
    TITLE : String,
    VIEWER : String
});
//node.js upload file type
//var files = file({ext:'.png'});
/*if(files ==! null){
    res.render('file');
}*/
var storage = multer.diskStorage({
    destination: './public/file-upload',
    filename: function(req,file,callback){
        callback(null,Date.now()+'_'+file.originalname);
    }
});
var filefilter = function(req,file,cb){
    if(file.fieldname == 'fileupload'){
        if(file.mimetype.indexOf('image') > -1){
            cb(null,true);
        }else{
            cb(null,false);
        }
    }else{
        cb(new error('error'));
    }
};
var upload = multer({storage: storage,fileFilter:filefilter}).single('fileupload');
var User = mongoose.model("user",userschema);
var Board = mongoose.model("board",boardschema);
router.get('/home', function(req, res, next) {
    User.find(function(err,doc) {
        res.render('KKB', {title: 'home', users: doc});
        });
});
router.get('/CreateAccount', function(req, res, next) {
    res.render('CreateAccount', { title: 'CreateAccount' });
});
router.get('/song', function(req, res, next) {
    res.render('KKBsong', { title: 'song' });
});
router.get('/board', function(req, res, next) {
    Board.find(function(err,doc) {
        var page1 = req.query.page;
        var apage1 = req.query.apage;
        var board = new Board();
        var boardids = 0;
        boardids = board.id;
        var page = parseInt(page1);
        var apage = parseInt(apage1);
        res.render('KKBboard', {title: 'board' , boards: doc , start: page,last: page+10});
    });
});
router.get('/board2', function(req, res, next) {
    Board.find(function(err,doc) {
        res.render('KKBboard', {title: 'board' , boards: doc , start: 11,last: 21});
    });
});router.get('/board1', function(req, res, next) {
    Board.find(function(err,doc) {
        res.render('KKBboard', {title: 'board' , boards: doc , start: 1,last: 11});
    });
});
router.get('/WriteBoard', function(req, res, next) {
    res.render('WriteBoard', { title: 'writeboard' });
});
router.get('/ReadBoard', function(req, res, next) {
    Board.find(function(err,doc) {
        var id = req.query.id;
        res.render('ReadBoard', {title: 'readboard' , boards: doc , select: id});
    });
});
router.get('/login', function(req, res, next) {
    if(req.query.id && req.query.pw){
        res.render('KKB');
    }
    else{
        res.render('Login');
    }
});
router.get('/file', function(req, res, next) {
    res.render('File');
});
router.post('/file', function(req, res, next) {
    upload(req,res,function(err){
        if(err){
            res.end('upload failed');
        }
    });
    res.render('File');
});
router.post('/WriteBoard', function(req, res, next) {
    if(req.body.title!==""){
        //var user = new User();
        Board.find(function(err,doc){
            var board = new Board();
            var boardid = 0;
            boardid = Number(doc[doc.length-1].ID) + 1;
            var d = new Date(Date.now());
            board.TIME = d.toLocaleDateString()+" "+ d.toLocaleTimeString();
            board.TITLE = req.body.title;
            board.TEXT = req.body.text;
            board.VIEWER = 0;
            board.ID = boardid.toString(10);
            board.save();
            res.redirect('/KKB/board');
        });
        }
    else{
        res.render('WriteBoard');
    }
})
router.post('/CreateAccount', function(req, res, next) {
    if(req.body.id!==null && req.body.pw!==null && req.body.name!==null && req.body.old!==null && req.body.phone!==null){
        var user = new User();
        user.ID = req.body.id;
        user.PW = req.body.pw;
        user.NAME = req.body.name;
        user.PHONE = req.body.phone;
        user.OLD = req.body.old;
        user.save();
        res.render('Login', {user:user});
    }
    else{
        res.render('CreateAccount');
    }
});
router.post('/login', function(req, res, next) {
    if(req.body.id!==null && req.body.pw!==null){
         var user = new User();
         User.find(function(err,doc){
             if(doc.length > 0){
                 res.render('KKB',{ users:doc});
             }
             else{
                 res.render('Login');
             }
         });
    }
});




module.exports = router;