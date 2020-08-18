const express = require('express');
const app = express();

const cors = require('cors');
const knex = require('knex')

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'postgres',
      database : 'smart-brain'
    }
  });

// db.select('*').from('users')
// .then(data=>console.log(data));

// *** for bcrypt-nodejs
const bcrypt = require('bcrypt-nodejs')

// *** for bcrypt
// const bcrypt=require('bcrypt');
// const saltRounds = 10 // increase this if you want more iterations  


const database = {
    users: [
        {
            id: '123',
            name: 'aboo',
            email: 'aboo@gmail.com',
            password:'aboo',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'eli',
            email: 'eli@gmail.com',
            password: 'eli',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'aboo@gmail.com'
        }
    ]
};

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

    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0])
    } else {
        res.status(400).json('Error logging in')
    }
    // res.json(req.body)
});


app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    /// this is bcrypt-nodejs
    bcrypt.hash(password, null, null, function (err, hash) {
        console.log(hash)

    });


    /// this is bcrypt
    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log('new hash',hash)
    // });
    db('users')
    .returning('*')
    .insert({
        email:email,
        name:name,
        joined:new Date()
    })
        .then(user=>{
            res.json(user[0])
        })
        .catch(err=>res.status(400).json('Unable to Register!!!'))

});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
   db('users').select('*').where({
       id:id
   })
   .then(user=>console.log(user[0]))
    if (!found) {
        res.status(404).json('Not found')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found === true;
            user.entries++
            return res.json(user.entries)
        }
    })
    if (!found) {
        res.status(404).send('Not found')
    }
})

app.listen(3000, () => {
    console.log('App listening to PORT 3000')
});



