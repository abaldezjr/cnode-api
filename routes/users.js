const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController')
const login = require('../middleware/login');

/*
    ROTAS PRIVADAS
*/

//LISTAR USUARIOS
router.get('/', login.obrigatorio, userController.getUsers);

//LISTAR UM USUARIO
router.get('/:user_id', login.obrigatorio, userController.getOneUser);

//ATUALIZAR USUARIO
router.patch('/', login.obrigatorio, userController.patchUser);

//DELETAR USUARIO
router.delete('/', login.obrigatorio, userController.deleteUser);

/*
    ROTAS PUBLICAS
*/

//CADASTRAR USUARIO
router.post('/', userController.postUsers);

//LOGIN
router.post('/login',userController.login);

module.exports = router;