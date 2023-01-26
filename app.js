const express = require('express');
const app = express();
const morgan = require('morgan');
const userRoute = require('./routes/users');
const partnerRoute = require('./routes/partners');

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header('Access-Control-Alow-Origin', '*');
    res.header('Access-Control-Alow-Header',
        'Origin, X-Requested-With, Content-Type, Accepted, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Alow-Methods',
            'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).send({});
    }

    next();
});

app.use('/usuarios', userRoute);
app.use('/parceiros', partnerRoute);

app.post('/', (req, res) => {

    res.json({
        message: req.body
    });

});

app.use((req, res, next) => {
    const error = new Error('Não encontrado.');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            message: error.message
        }
    });
});


module.exports = app;
