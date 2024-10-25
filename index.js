const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;

app.use(express.static(path.join(__dirname, 'frontend')));
app.set('views', path.join(__dirname, 'frontend'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let mensagens = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('mensagensAnteriores', mensagens);

    socket.on('enviaMensagem', data => {
        mensagens.push(data);
        socket.broadcast.emit('mensagemRecebida', data);
    });

    socket.on('limparMensagens', () => {
        mensagens = []; 
        io.emit('mensagensAnteriores', mensagens); 
    });
});

server.listen(port);
