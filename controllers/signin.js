
const handleSignin=(req,res,db,bcrypt) => {
    // // Load hash from your password DB.
    // bcrypt.compare("bacon", hash, function(err, res) {
    //     // res == true
    // });
    // bcrypt.compare("veggies", hash, function(err, res) {
    //     // res = false
    // });

  db.select('email','hash').from('login')
  .where('email','=',req.body.email)
  .then(data=>{
      const isValid=bcrypt.compareSync(req.body.password, data[0].hash);
      if(isValid){
          return db.select('*').from('users')
          .where('email','=',req.body.email)
          .then(user=>{
            //   console.log(user)
              res.json(user[0])
            })
            .catch(err=>res.status(400).json('unable to get user'))
      }else {
        res.status(400).json('wrong username or password!!!') 
      }
  })
  .catch(err=>res.status(400).json('wrong username or password!!!'))
    // res.json(req.body)
};



module.exports={
    handleSignin:handleSignin
};


