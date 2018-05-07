var express = require('express');
var router = express.Router();

var materiaprima_controller = require('../controllers/materiaprimaController');
var receta_controller = require('../controllers/recetaController');

router.get('/materiasprimas', materiaprima_controller.materiaprima_list);
router.get('/materiasprimas/caducar', materiaprima_controller.proximos_a_caducar);
router.get('/materiasprimas/costo', materiaprima_controller.costo);
router.get('/materiasprimas/costo-caducados', materiaprima_controller.costo_caducados);
router.get('/materiasprimas/categoria/:cat', materiaprima_controller.materiaprima_category_list);
router.post('/materiasprimas', materiaprima_controller.materiaprima_create);
router.get('/materiasprimas/:id', materiaprima_controller.materiaprima_read);
router.put('/materiasprimas/:id', materiaprima_controller.materiaprima_update);
router.delete('/materiasprimas/:id', materiaprima_controller.materiaprima_delete);
router.post('/materiasprimas/:id', materiaprima_controller.create_instance);
router.delete('/materiasprimas/:id/instancias/:iid', materiaprima_controller.delete_instance);

router.get('/recetas', receta_controller.receta_list);
router.get('/recetas/caducar', receta_controller.proximos_a_caducar);
router.get('/recetas/costo', receta_controller.costo);
router.get('/recetas/costo-caducados', receta_controller.costo_caducados);
router.post('/recetas', receta_controller.receta_create);
router.get('/recetas/:id', receta_controller.receta_read);
router.put('/recetas/:id', receta_controller.receta_update);
router.delete('/recetas/:id', receta_controller.receta_delete);
router.post('/recetas/:id', receta_controller.create_instance);
router.delete('/recetas/:id/instancias/:iid', receta_controller.delete_instance);

module.exports = router;
