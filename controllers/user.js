const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, then) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                var user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                .then(() => {
                    console.log( user._id);
                    res.status(201).json({ message: 'Utilisateur créé !'})
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
            })
            .catch(error => res.status(500).json({ error }));
        } else {
            return res.status(401).json({ message: 'Email déja utilisé !'});
        }
        
    })
    .catch(error => res.status(500).json({ error }));
    
};

exports.login = (req, res, then) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'c19cf0ee354dee5163bf6b19f0a52cca1892ee15aa5acddd4df33d6a48d62075',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};