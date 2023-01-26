const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//LISTAR USUARIOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }

        conn.query('SELECT * FROM users',
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
                    users: results.map(user => {
                        return {
                            user_id: user.user_id,
                            username: user.username,
                            request: {
                                type: 'GET',
                                description: 'Listar usuarios',
                                url: `http://localhost:3000/usuarios/${user.user_id}`
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        );
    });
});

//CADASTRAR USUARIO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'INSERT INTO users(username, password) VALUES (?, ?)',
            [req.body.username, req.body.password],
            (error, results, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    message: 'Usuario cadastrado',
                    newUser: {
                        user_id: results.insertId,
                        username: req.body.username,
                        request: {
                            type: 'POST',
                            description: 'Cadastrar usuario',
                            url: `http://localhost:3000/usuarios`
                        }
                    }
                }
                return res.status(201).send(response);
            });
    });
});

//LISTA UM USUARIO
router.get('/:user_id', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }

        conn.query('SELECT * FROM users WHERE user_id = ?',
            [req.params.user_id],
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
                        message: `Não foi encontrado um usuario com o id = ${req.params.user_id}`
                    });
                }

                const response = {
                    message: 'Usuario cadastrado',
                    user: {
                        user_id: results[0].user_id,
                        username: results[0].username,
                        request: {
                            type: 'GET',
                            description: 'Listar um usuario',
                            url: `http://localhost:3000/usuarios`
                        }
                    }
                }
                return res.status(200).send(response);
            }
        );
    });

});

//ATUALIZAR USUARIO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            `UPDATE users SET username = ?, password = ? WHERE user_id = ?`,
            [req.body.username, req.body.password, req.body.user_id],
            (error, results, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    message: 'Usuario atualizado',
                    user: {
                        user_id: req.body.user_id,
                        username: req.body.username,
                        request: {
                            type: 'PATCH',
                            description: 'Atualizar usuario',
                            url: `http://localhost:3000/usuarios/${req.body.user_id}`
                        }
                    }
                }
                return res.status(202).send(response);

            });
    });
});

//ATUALIZAR USUARIO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            `DELETE FROM users WHERE user_id = ?`,
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
                    message: "Usuario deletado",
                    request: {
                        type: 'DELETE',
                        description: 'Cadastrar usuario',
                        url: `http://localhost:3000/usuarios`,
                        body: {
                            username: "String",
                            password: "String"
                        }
                    }
                }
                return res.status(202).send(response);
            });
    });
});

//LOGIN
router.post('/login', (req, res, next) => {
    /*mysql.getConnection(
        (error, conn) => {
            if (error) {
                return res.status(500).send({ error: error });
            }
            const query = "SELECT * FROM USUARIOS WHERE email = ?";
            conn.query(query.body.email, (errors, results, fileds) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
 
                if(results.length < 1) {
                    return res.status(401).send({mensagem: 'Falha na autenticação.'});
                }
            });
        }
    );
    res.json({
        message: 'login'
    });*/
    res.status(200).send({
        message: '[post] Rota: usuarios/login'
    });
});

//LOGOUT
router.post('/logout', (req, res) => {
    res.json({
        message: 'logout'
    });
});

module.exports = router;