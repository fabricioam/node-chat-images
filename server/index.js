const express = require('express');
const app = express();
const cookieParse = require('cookie-parser');
const session = require('express-session');
const server = require('http').Server(app);
let io = require('socket.io')(server);

app.use(session({
    secret: 'word secret',
    resave: true,
    saveUninitialized: true
}));

//Autenticación
let auth = (req, res, next) => {
    if (req.sessionID != "") {
        return next()
    }
}

let ipAddresses = []
let name
let id;
let idSession;
let saludo;
let ip4;
let users = []


app.get('/', (req, res) => {
    id = req.sessionID
    console.log(`Session : ${req.sessionID}`);
    res.sendfile('client/login.html');
});

app.get('/salachat', (req, res) => {
    console.log("id", id);
    if (!userWhitIp(ip4)) {
        res.redirect('/')
    } else {
        res.sendfile('client/index.html')
    }
    console.log("obtenido de funcion", userWhitIp(ip4));
    console.log("ip obtenida desde sala", findIP(ip4));

});

let findIP = (ip) => {

    console.log(`ip recibida en la función findIP ${ip}`)
    let ipFound = ipAddresses.find(ipA => {
        return ipA == ip
    })
    return ipFound;
}

let userWhitIp = (ip) => {

    console.log('Entramos a la función userWhitIp')
    console.log(`Se buscará usuario con la ip ${ip}...`);

    let usuarioEncontrado = users.find((user) => {
        return user[0].ip == ip;
    })

    return usuarioEncontrado

    console.log('salimos de la función')

}

let getSession = () => {
    return id;
}

app.use(cookieParse());
app.use(express.static('client')); //Middleware de express para servir html estáticos

let messages = [{
    id: 1,
    text: 'Bienvenido al chat desarrollado con Node js y Socket.io',
    nombreUsuario: 'Bot - Fabricio Arcos',
    user: ""
}]

let addUser = (name, ip, id) => {
    let newUser = [{
        name,
        ip,
        id,
        sessionID
    }]
    users.push(newUser);
}


io.on('connection', (socket) => { //Conexión al socket 
    console.log('id dentro del socket', id);
    let session = id;
    console.log(`Con otra variable ${session}`)
    ip4 = socket.handshake.address;
    let ip = socket.handshake.address;
    console.log(users);
    console.log(ipAddresses)
    console.log(`El dispositivo con IP: ${socket.handshake.address} se ha conectado`);

    let ipRepeat = ipAddresses.find(address => {
        return address == ip;
    });

    if (ipRepeat != null) {
        console.log('Esa ip ya esta en uso');
    } else {
        ipAddresses.push(socket.handshake.address);
    }

    socket.on('user-image', image => {
        io.sockets.emit('add-image', name, image);
        console.log('Socket recibido y enviado a todos')
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado`);
    });

    socket.on('add-user', (user) => {
        sessionID = session + user;
        console.log(sessionID)
        name = user;
        saludo = `Hola ${name}`;
        console.log(`id sesion dentro del add-use ${session}`)
        addUser(user, ip, session);
        console.log(users)
        console.log(user);
        socket.emit('saludo', saludo);
        io.sockets.emit('active', user);
        // io.sockets.emit('messages', message);
        // console.log(messages.nombreUsuario);
    });

    socket.on('add-message', (data) => {
        console.log(data);
        if (data.text != "") {
            messages.push(data);
            console.log(messages)
            io.sockets.emit('messages', messages);
        }

    });
    socket.emit('messages', messages);
    socket.emit('name', name);
});

server.listen(4444, () => {
    console.log("Servidor corriendo en http://localhost:4444");
});