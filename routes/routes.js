var express=require('express');
var router=express.Router();

// middleware to use for all requests
router.use(function(req,res,next){
  // do logging
  console.log('Something is happening.');
  next();  
});

// test router
router.get('/',function(req,res){
    res.json({message: 'hooray! welcome to the api!'});
});

// routes with /users
router.route('/users')
    // create a user: http://localhost:3000/api/users
    .post(function(req,res){
        var user=new User();
        user.name=req.body.name;
        // save user
        user.save(function(err){
            if(err){ res.send(err); }
            res.json({message: 'User created!'});
        });
    })
    .get(function(req,res){
        User.find(function(err,users){
            if(err){ res.send(err); }
            res.json(users);
        });
    });

// routes with /users/:user_id
router.route('/users/:user_id')
    // get user by id: http://localhost:3000/api/users/:user_id
    .get(function(req,res){
        User.findById(req.params.user_id,function(err,user){
            if(err){ res.send(err); }
            res.json(user);
        });
    })
    .put(function(req,res){
        User.findById(req.params.user_id,function(err,user){
            if(err){res.send(err);}
            user.name=req.body.name; // update user info
            user.save(function(err){
                if(err){res.send(err);}
                res.json({message:'User updated!'});
            });
        });
    })
    .delete(function(req,res){
        User.remove({
            _id: req.params.user_id
        },function(err,user){
            if(err){res.send(err);}
            res.json({message:'Successfully deleted'});
        });
    });
    
    module.exports.router=router;