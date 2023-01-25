const express = require('express');
const app = express();

//forma de ler JSON (Middleware)
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

/*app.use((req, res, next) => {
    res.status(200).send({
        mensagem: "Deu certo"
    });
});*/

//rota inicial / endpoint
app.get('/', (req, res) => {
    //mostrar req

    res.json({
        message: 'Oi Express!'
    });

});


//entregar uma porta



module.exports = app;
