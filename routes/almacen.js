var express = require('express');
var router = express.Router();

var materiaprima_controller = require('../controllers/materiaprimaController');
var receta_controller = require('../controllers/recetaController');

router.get('/materiasprimas', materiaprima_controller.materiaprima_list);
router.get('/materiasprimas/categoria/:cat', materiaprima_controller.materiaprima_category_list);
router.post('/materiasprimas', materiaprima_controller.materiaprima_create);
router.get('/materiasprimas/:id', materiaprima_controller.materiaprima_read);
router.put('/materiasprimas/:id', materiaprima_controller.materiaprima_update);
router.delete('/materiasprimas/:id', materiaprima_controller.materiaprima_delete);
router.post('/materiasprimas/:id', materiaprima_controller.create_instance);
router.delete('/materiasprimas/:id/instancias/:iid', materiaprima_controller.delete_instance);

router.get('/recetas', receta_controller.receta_list);
router.post('/recetas', receta_controller.receta_create);
router.get('/recetas/:id', receta_controller.receta_read);
router.put('/recetas/:id', receta_controller.receta_update);

module.exports = router;
