const express = require('express');
const app = express();

// *** for bcrypt-nodejs
const bcrypt=require('bcrypt-nodejs')

// *** for bcrypt
// const bcrypt=require('bcrypt');
// const saltRounds = 10 // increase this if you want more iterations  


const database = {
    users: [
        {
            id: '123',
            name: 'aboo',
            email: 'aboo@gmail.com',
                        entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'eli',
            email: 'eli@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login:[
        {
            id:'987',
            hash:'',
            email:'aboo@gmail.com'
        }
    ]
};

// Middlewares **********
app.use(express.json());

//********************* */
// app.use(express.urlencoded({extended: false}));
app.get('/', (req, res) => {
    res.json(database.users)
})

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
        res.json('Success Sign in')
    } else {
        res.status(400).json('Error logging in')
    }
    // res.json(req.body)
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    
    /// this is bcrypt-nodejs
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash)
       
    });

   
/// this is bcrypt
// bcrypt.hash(password, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
//     console.log('new hash',hash)
// });

    
    
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found === true;
            return res.json(user)
        }
    })
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



//////
// / --> res=it's working
// /signin --> POST =success/fail
// /register --> POST =user
// /profile/:id -->GET =user
// /image --> PUT --> =user


///////