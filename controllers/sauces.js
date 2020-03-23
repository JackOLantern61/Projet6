const Sauces = require('../models/Sauces');
const fs = require('fs');

/* retourne  un objet sauce correspondant a l'id passé en paramètre */
exports.getOneSauce = (req, res, then) => {
    Sauces.findOne({ _id: req.params.id})
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }));
};

/* retourne un tableau d'objet sauce */
exports.getAllSauces = (req, res, then) => {
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

/* découpe la chaîne selon les espaces et remplace dans chaque morceau les caractères spéciaux par des underscore */
const replaceCharacter = ( chaine ) => {
    partChaine = chaine.split(' ');
    let recompose = "";
    for (let part in partChaine) {
        if (/['\|\/\\\*\+&#"\{\(\[\]\}\)$£€%=\^`]/g.test(partChaine[part]) && !(/([a-zA-Z]{1}\'[a-z]{1})/gi.test(partChaine[part]))) {
            partChaine[part] = partChaine[part].replace(/['\|\/\\\*\+&#"\{\(\[\]\}\)$£€%=\^`]/g, '_');
        }
        if (part == (partChaine.length - 1 )) {
            recompose += partChaine[part]; 
        } else {
            recompose += partChaine[part] + ' ';
        }
    }
    return recompose;
}

/* remplacement des caractères spéciaux présent dans les différent champs */
const securitySauce = ( sauce ) => {
    try{
        sauce.name = replaceCharacter(sauce.name);
        sauce.manufacturer = replaceCharacter(sauce.manufacturer);
        sauce.description = replaceCharacter(sauce.description);
        sauce.mainPepper = replaceCharacter(sauce.mainPepper);
        return sauce;
    } catch (error) {
        res.status(401).json({ error });
        return 0;
    }
}

/* Enregistre dans la BDD la sauce que l'utilisateur a créer */
exports.createSauce = (req, res, then) => {
    var sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    /* remplacement des caractères spéciaux présent dans les différent champs */
    if(!securitySauce(sauceObject)) { return; };

    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));

};

/* modifie la sauce dont l'id est passé en paramètre */
exports.modifySauce = (req, res, then) => {
    const sauceObject = req.file ? 
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    /* remplacement des caractères spéciaux présent dans les différent champs */
    if(!securitySauce(sauceObject)) { return; };
    
    if (req.file) {
        /* supprime l'ancienne image de la sauce si une nouvelle est fournis */
        Sauces.findOne({ _id: req.params.id })
		.then( sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    console.log("failed to delete local image:"+err);
                }
            });
        })
        .catch(error => res.status(500).json({ error }));
    }
    Sauces.updateOne({_id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

/* supprime la sauce dont l'id est en paramètre */
exports.deleteSauce = (req, res, then) => {
    Sauces.findOne({ _id: req.params.id})
		.then( sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({_id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

/* gère les likes et dislike */
exports.likeSauce = (req, res, then) => {
    Sauces.findOne({ _id: req.params.id})
		.then( sauce => {
            switch (req.body.like) {
                case -1:
                    /* n'aime pas : on incrémente les dislikes et on ajoute le userId au array usersDisliked*/
                    sauce.dislikes++;
                    sauce.usersDisliked.push(req.body.userId);
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.likes--;
                        let index = sauce.usersLiked.indexOf(req.body.userId);
                        sauce.usersLiked.splice(index, 1);
                    }
                    break;
                case 0:
                    /* annule le vote : supprime le userId du array ou il se trouve et décrémente le likes ou dislikes*/
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.likes--;
                        let index = sauce.usersLiked.indexOf(req.body.userId);
                        sauce.usersLiked.splice(index, 1);
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.dislikes--;
                        let index = sauce.usersDisliked.indexOf(req.body.userId);
                        sauce.usersDisliked.splice(index, 1);
                    }
                    break;
                case 1:
                    /* aime : incrémente les likes et ajoute le userId au array usersLiked*/
                    sauce.likes++;
                    sauce.usersLiked.push(req.body.userId);
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.dislikes--;
                        let index = sauce.usersDisliked.indexOf(req.body.userId);
                        sauce.usersDisliked.splice(index, 1);
                    }
                    break;
                default:
                    res.status(404).json({ message: "Error : unknow like type !" });
                    break;
            }
            /* mise a jour de la bdd */
            Sauces.updateOne({_id: req.params.id }, { 
                likes: sauce.likes, 
                dislikes: sauce.dislikes, 
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                _id: req.params.id })
                .then(() => {
                    res.status(200).json({ message: 'Like de la sauce modifié !'});
                    })
                .catch(error => {
                    res.status(400).json({ error });
                });
        })
		.catch(error => {
            res.status(404).json({ error });
        });
}

