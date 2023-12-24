/**
 * Created by Wang Shenghao on 6/16/2017.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://eric:eric@ds127802.mlab.com:27802/mytasklist_eric1993', ['tasks']);

// Get All Tasks
router.get('/tasks', function(req, res, next){
    // res.send('TASK API');
    db.tasks.find(function(err, tasks) {
        if(err) {
            res.send(err);
        }
        res.json(tasks);
    });
});

// Get Single Task
router.get('/task/:id', function(req, res, next){
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
        if(err) {
            res.send(err);
        }
        res.json(task);
    });
});

// Save Task
router.post('/task', function(req, res, next){
   var task = req.body;
   if(!task.title || (task.isDone + '')) {
       res.status(400);
       res.json({
          "error": "Bad Data"
       });
   } else {
       db.tasks.save(task, function(err, task){
          if(err){
              res.send(err);
          }
          res.json(task);
       });
   }
});

// Delete Task
router.delete('/task/:id', function(req, res, next){
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
        if(err) {
            res.send(err);
        }
        res.json(task);
    });
});

// Update Task
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    var updTask = {};

    if(task.isDone){
        updTask.isDone = task.isDone;
    }

    if(task.title){
        updTask.title = task.title;
    }

    if(!updTask){
        res.status(400);
        res.json({
            "error": "Bad Data"
        })
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function(err, task) {
            if(err) {
                res.send(err);
            }
            res.json(task);
        });
    }


});

module.exports = router;