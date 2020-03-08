const Sauces = require('../models/Sauces');
const fs = require('fs');


exports.getUneSauce = (req, res, then) => {
    Sauces.findOne({ _id: req.params.id})
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, then) => {
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.creeSauce = (req, res, then) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersliked: [],
        usersdisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));

};

exports.modifieSauce = (req, res, then) => {
    const sauceObject = req.file ? 
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauces.updateOne({_id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.supprimeSauce = (req, res, then) => {
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

exports.likeSauce = (req, res, then) => {
    Sauces.findOne({ _id: req.params.id})
		.then( sauce => {
            switch (req.body.like) {
                case -1:
                    /* n'aime pas*/
                    break;
                case 0:
                    /* annule le vote */
                    break;
                case 1:
                    /* aime */
                    break;
                default:
                    res.status(404).json({ message: "Error : unknow like type !" });
                    break;
            } 
            res.status(200).json(sauce)
        })
		.catch(error => res.status(404).json({ error }));
}

