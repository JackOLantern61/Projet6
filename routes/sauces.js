const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
/*const auth = require('../middleware/auth');*/
const multer = require('../middleware/multer-config');


/* recuperer une sauce */
router.get('/:id', saucesCtrl.getUneSauce);
/* recuperer toutes les sauces */
router.get('/', saucesCtrl.getAllSauces);
/* enregistre la sauce recu dans la BDD */
router.post('/', multer, saucesCtrl.creeSauce);
/* met a jour la sauce image et ou contenu */
router.put('/:id', multer, saucesCtrl.modifieSauce);
/*supprime la sauce */
router.delete('/:id', saucesCtrl.supprimeSauce);

/* aime ou pas la sauce */
router.post('/:id/like', saucesCtrl.likeSauce);

module.exports = router;