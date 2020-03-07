const express = require('express');
const router = express.Router();

/* toutes les sauces */
router.get('/', (req, res, then) => {
    res.status(200).json({ message: 'fonctionne'});
});
/* une sauce */
router.get('/:id', (req, res, then) => {
    res.status(200).json({ message: 'une sauce'});
});
/* enregistre la sauce recu dans la BDD */
router.post('/', (req, res, then) => {
    res.status(201).json({ message: 'nouvelle sauce recu'});
});
/* met a jour la sauce image/contenu */
router.put('/:id', (req, res, then) => {
    res.status(201).json({
        message: 'sauce mise a jour'
    });
});
/*supprime la sauce */
router.delete('/:id', (req, res, then) => {
    res.status(200).json({ message: 'sauce supprimer'});
});


module.exports = router;