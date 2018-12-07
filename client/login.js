let socket = io.connect('http://192.168.0.9:4444', { forceNew: true });

socket.on('reconnect_failed', function(datos) {
    alert("Error: !! No se puede conectar al servidor de websockets. !!", "error");
});

socket.on('saludo', saludo => {
    sala();
});

let newUser = (e) => {
    let name = document.getElementById('username').value;
    if (name != "") {
        socket.emit('add-user', name);
        return false;
    } else {
        alert('POR FAVOR INGRESE UN NOMBRE PARA ENTRAR AL CHAT')
    }

}

let sala = () => {
    window.location.replace('http://192.168.0.9:4444/salachat');
}