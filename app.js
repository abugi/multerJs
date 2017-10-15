var express = require('express'),
     multer = require('multer'),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose'),
     cors = require("cors"),
     app = express();

mongoose.connect("mongodb://localhost/formdb");

app.set('view engine', 'ejs');
app.use(express.static('public'));

var storage = multer.diskStorage({
     destination: function(req, file, callback){
          callback(null, './public/uploads');
     },
     filename: function(req, file, callback){
          //console.log(file);
          callback(null, file.originalname);
     }
});

var upload = multer({storage: storage}).single('upload');

var formSchema = mongoose.Schema({
     course: String,
     file: {}
});

var formdemo = mongoose.model("formdemo", formSchema);

app.get('/', function(req, res){
     res.render('index', {add: add});
});

app.post('/upload', function(req, res){
     upload(req, res, function(err){
          if(err){
               console.log(err);
          }else{
               //  console.log(req.file);
               // console.log(req.body);
          var newDB = new formdemo({
               course: req.body.body,
               file: req.file
          });
          newDB.save(function(err, data){
               if(err){
                    console.log(err);
               }else{
                    res.redirect("/upload");
               }
           });
          }
     });
});

app.get('/upload', cors(), function(req, res){
     formdemo.find({}, function(err, data){
          if(err){
               console.log(err);
          }else{
               res.render("upload", {data: data});
          }
     });
});

app.listen(3000, function(){
     console.log('Serve started for Multer Demo App');
})