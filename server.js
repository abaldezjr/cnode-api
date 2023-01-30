//configuração inicial
const http = require('http');
const port = process.env.PORT || 3000;
const app = require('./app');
const server = http.createServer(app);
const uri = 'http://localhost:';
server.listen(port, () => {
     console.log(`Servidor rodando na URL ${uri}${port}`);
});

