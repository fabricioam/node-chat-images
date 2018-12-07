let socket = io.connect('http://192.168.0.9:4444', { forceNew: true });
let userName;

socket.on('connect_error', function(datos) {
    alert("Error: !! No se puede conectar al servidor. !!");
});

socket.on('messages', (data) => {
    console.log(data);
    render(data);
});


socket.on('active', (name) => {
    newUser(name);
})

socket.on('name', (name) => {
    userName = name;
    bienvenida(name);
});

socket.on('add-image', (msg, base64image) => {
    console.log('imagen recibida')
    $('#images')
        .append(
            $('<p>').append($('<b>').text(), '<a target="_blank" href="' + base64image + '"><img src ="' + base64image + '"/></a>')
        );
});

let newUser = (user) => {
    let html = (`El usuario ${user} se ha unido al chat`);
    let div_new = document.getElementById('new');
    div_new.innerHTML = html
}

let bienvenida = (user) => {
    let html = (`<p>Bienvenido al chat ${user}</p>`);
    let div_saludo = document.getElementById('saludo');
    div_saludo.innerHTML = html;
}

let render = (data) => {
    let html = data.map((message, index) => { //El primer parámetro es el elemento del array y el segundo es el indice
        return (`
            <div class="message">
                <strong>${message.nombreUsuario}</strong> dice:
                <p>${message.text}</p>
            </div>
        `)
    }).join(' '); //para poner espacios

    let div_msgs = document.getElementById('messages');
    div_msgs.innerHTML = html;
    div_msgs.scrollTop = div_msgs.scrollHeight;
}

let addMessage = (e) => {

    let message = {
            nombreUsuario: userName,
            text: document.getElementById('text').value
        }
        //document.getElementById('nombreUsuario').style.display = 'none'
    document.getElementById('text').value = "";
    socket.emit('add-message', message);
    return false;

}