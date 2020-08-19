const express = require('express');
const app = express();

const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postgres',
        database: 'smart-brain'
    }
});

// db.select('*').from('users')
// .then(data=>console.log(data));

// *** for bcrypt-nodejs
const bcrypt = require('bcrypt-nodejs')

// *** for bcrypt
// const bcrypt=require('bcrypt');
// const saltRounds = 10 // increase this if you want more iterations  



// Middlewares **********
app.use(express.json());
// app.use(express.urlencoded({extended: false}));
app.use(cors());

//********************* */



app.get('/', (req, res) => {
    res.json(database.users)
});



app.post('/signin', (req, res) => {
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
});


app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    /// this is bcrypt-nodejs
    // ASYNC
    // bcrypt.hash(password, null, null, function (err, hash) {
    //     console.log(hash)

    // });

    // SYNC
    const hash = bcrypt.hashSync(password);


    /// this is bcrypt
    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log('new hash',hash)
    // });
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })

        .catch(err => res.status(400).json('Unable to Register!!!'))

});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db('users').select('*').where({
        id: id
    })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }

        })
        .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.json('Unable to get entries'))
})

app.listen(3000, () => {
    console.log('App listening to PORT 3000')
});



