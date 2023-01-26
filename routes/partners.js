const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//LISTAR PARCEIROS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }

        conn.query('SELECT * FROM partners',
            (error, results, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    amount: results.length,
                    partners: results.map(partner => {
                        return {
                            partner_id: partner.partner_id,
                            name: partner.name,
                            request: {
                                type: 'GET',
                                description: 'Listar parceiros',
                                url: `http://localhost:3000/parceiros/${partner.partner_id}`
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        );
    });
});

//CADASTRAR PARCEIRO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'INSERT INTO partners(name, fk_user_id) VALUES (?, ?)',
            [req.body.name, req.body.fkUserId],
            (error, results, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    message: 'Parceiro cadastrado',
                    newPartner: {
                        partner_id: results.insertId,
                        name: req.body.name,
                        request: {
                            type: 'POST',
                            description: 'Cadastrar parceiro',
                            url: `http://localhost:3000/parceiros`
                        }
                    }
                }
                return res.status(201).send(response);
            });
    });
});

//LISTAR UM PARCEIRO
router.get('/:partner_id', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }

        conn.query('SELECT * FROM partners WHERE partner_id = ?',
            [req.params.partner_id],
            (error, results, fields) => {

                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                if (results.length == 0) {
                    return res.status(404).send({
                        message: `Não foi encontrado um parceiro com o id = ${req.params.partner_id}`
                    });
                }

                const response = {
                    message: 'Parceiro cadastrado',
                    partner: {
                        partner_id: results[0].partner_id,
                        name: results[0].name,
                        request: {
                            type: 'GET',
                            description: 'Listar um parceiro',
                            url: `http://localhost:3000/parceiros`
                        }
                    }
                }
                return res.status(200).send(response);
            }
        );
    });

});

//ATUALIZAR PARCEIRO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            `UPDATE partners SET name = ? WHERE partner_id = ?`,
            [req.body.name, req.body.partner_id],
            (error, results, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    message: 'Parceiro atualizado',
                    partner: {
                        partner_id: req.body.partner_id,
                        name: req.body.name,
                        request: {
                            type: 'PATCH',
                            description: 'Atualizar parceiro',
                            url: `http://localhost:3000/parceiros/${req.body.partner_id}`
                        }
                    }
                }
                return res.status(202).send(response);

            });
    });
});

//DELETAR PARCEIRO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            `DELETE FROM partners WHERE partner_id = ?`,
            [req.body.user_id],
            (error, results, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    message: "Parceiro deletado",
                    request: {
                        type: 'DELETE',
                        description: 'Cadastrar parceiro',
                        url: `http://localhost:3000/parceiros`,
                        body: {
                            name: "String",
                        }
                    }
                }
                return res.status(202).send(response);
            });
    });
});

module.exports = router;