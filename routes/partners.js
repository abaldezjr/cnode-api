const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const partnerController = require('../controller/PartnerController');

/*
    ROTAS PRIVADAS
*/

//LISTAR PARCEIROS
router.get('/', login.obrigatorio, partnerController.getPartners);

//CADASTRAR PARCEIRO
router.post('/', login.obrigatorio, partnerController.postPartners);

//LISTAR UM PARCEIRO
router.get('/:partner_id', login.obrigatorio, partnerController.getOnePartner);

//ATUALIZAR PARCEIRO
router.patch('/', login.obrigatorio, partnerController.patchPartners);

//DELETAR PARCEIRO
router.delete('/', login.obrigatorio, partnerController.deletePartner);

/*
    ROTAS PRIVADAS
*/

module.exports = router;