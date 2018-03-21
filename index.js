'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var path = process.cwd();
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

var book = require('./books.js');

app.get('/', function(req, res) {                   
    res.render('index.html');			
});

app.get('/read',function(req,res){
    console.log(req.body);
    book.findOne({type:'all'},function(err,doc){
         book.findOne({type:'all'},function(err,doc){
            if(doc){
                res.json({books: doc.allbooks});
            }
            if(!doc){
                res.json({books: 'No books present!'});
            } 
         });
    });
    
});


app.post('/create',function(req,res){
    console.log(req.body.name);
    
    book.findOne({type:'all'},function(err,doc){
        
        if(doc){
            console.log('Present');
            book.update({type: 'all' },{$push: {allbooks:req.body.name }},{safe: true, upsert: true},function(err,doc){
                if(doc){
                    book.findOne({type:'all'},function(err,doc){
                        console.log(doc.allbooks);
                        res.json({books: doc.allbooks});
                    });
                }
            });
        }
        
         else if(!doc){
            book.create({type:'all',allbooks:[]},function(err,doc){
                if(doc){
                    console.log('Created');
                    book.update({type: 'all' },{$push: {allbooks:req.body.name }},{safe: true, upsert: true},function(err,doc){
                        if(doc){
                            book.findOne({type:'all'},function(err,doc){
                                console.log(doc.allbooks);
                                res.json({books: doc.allbooks});
                            });
                        }
                    });
                }
                else if(!doc){
                    console.log('Error in creating!');
                }
                else if(err){
                    console.log(err);
                }
            });
        }
                
        else if(err){
            console.log(err);
        }
        
    });
});


app.post('/update',function(req,res){
    console.log(req.body.name);
    console.log(req.body.newname);
    
    book.update({type:'all'}, {$pull: {allbooks:req.body.name}}, {safe: true, upsert: true},function(err,doc){
        if(doc){
            book.findOne({type:'all'},function(err,doc){
                console.log(doc.allbooks);
                book.update({type: 'all' },{$push: {allbooks:req.body.newname }},{safe: true, upsert: true},function(err,doc){
                    if(doc){
                        book.findOne({type:'all'},function(err,doc){
                            console.log(doc.allbooks);
                            res.json({books: doc.allbooks});
                        });
                    }
                });
            });
        }
    });
});

app.post('/delete',function(req,res){
    console.log(req.body);
    
    book.update({type:'all'}, {$pull: {allbooks:req.body.name}}, {safe: true, upsert: true},function(err,doc){
        if(doc){
            book.findOne({type:'all'},function(err,doc){
                console.log(doc.allbooks);
                res.json({books: doc.allbooks});
            });
        }
        
        else if(!doc){
            console.log('Error in deleting!');
        }
        else if(err){
            console.log(err);
        }
        
    })
});


app.listen(8080, function(){
    console.log("Example of app listning on port 8081");
});


