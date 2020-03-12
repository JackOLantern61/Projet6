const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

/* connexion a la base de donnée */
mongoose.connect('mongodb+srv://adminalheure:btz7h20qqVDN7YhB@so-pekocko-de3dz.gcp.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connection à MongoDB réussie !'))
.catch(() => console.log('Connection à MongoDB échouée !'));

const app = express();

/* définition du CROS */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

/* autorise l'accès aux fichier du dossier images */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* définition du chemin vers les fichiers contenant les routes */
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;