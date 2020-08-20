

const handleRegister=(req,res,db,bcrypt) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }

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

}



module.exports={
    handleRegister:handleRegister
};