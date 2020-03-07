const express = require('express');
const bodyParser = require('body-parser');
const mongooseDonnee = require('mongoose');
const mongooseBase = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

mongooseDonnee.connect('mongodb+srv://adminalheure:btz7h20qqVDN7YhB@so-pekocko-de3dz.gcp.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connection à MongoDB avec le compte pour les données réussie !'))
.catch(() => console.log('Connection à MongoDB avec le compte pour les données échouée !'));

mongooseBase.connect('mongodb+srv://adminentemps:xSanB7hmzH@so-pekocko-de3dz.gcp.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connection à MongoDB avec le compte pour la base réussie !'))
.catch(() => console.log('Connection à MongoDB avec le compte pour la base échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
  


app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;