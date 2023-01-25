const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).send({
        mensagem:"Deu certo"
    });
});

module.exports = app;
