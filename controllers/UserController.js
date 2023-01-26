const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//LISTAR USUARIOS
exports.getUsers = (req, res, next) => {
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
}

//CADASTRAR USUARIO
exports.postUsers = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }

        conn.query('SELECT * FROM users WHERE username = ?',
            [req.body.username], (error, results) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                if (results.length > 0) {
                    res.status(401).send({
                        message: 'Usuário já cadastrado'
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (errorBcrypt, hash) => {
                        if (errorBcrypt) {
                            return res.status(500).send({ error: errorBcrypt });
                        }

                        conn.query(
                            'INSERT INTO users(username, password) VALUES (?, ?)',
                            [req.body.username, hash],
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
                }
            });
    });
}

//LISTAR UM USUARIO
exports.getOneUser = (req, res, next) => {

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
}

//ATUALIZAR USUARIO

exports.patchUser = (req, res, next) => {
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
}

//DELETAR USUARIO

exports.deleteUser = (req, res, next) => {
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
}

//LOGIN
exports.login = (req, res, next) => {

    mysql.getConnection(
        (error, conn) => {
            if (error) {
                return res.status(500).send({ error: error });
            }

            conn.query("SELECT * FROM users WHERE username = ?",
                [req.body.username], (errors, results, fileds) => {
                    conn.release();
                    if (error) {
                        return res.status(500).send({ error: error });
                    }

                    if (results.length < 1) {
                        return res.status(401).send({ mensagem: 'Falha na autenticação.' });
                    }

                    bcrypt.compare(req.body.password, results[0].password, (error, result) => {
                        if (error) {
                            return res.status(401).send({ mensagem: 'Falha na autenticação.' });
                        }

                        if (result) {
                            const token = jwt.sign({
                                user_id: results[0].user_id,
                                username: results[0].username,
                            }, 
                            process.env.JWT_KEY,{
                                expiresIn: "1h"
                            }
                            );
                            return res.status(200).send({ 
                                mensagem: 'Autenticado com sucesso.',
                                token: token
                            });
                        }
                        return res.status(401).send({ mensagem: 'Falha na autenticação.' });
                    });

                });
        }
    );

}

