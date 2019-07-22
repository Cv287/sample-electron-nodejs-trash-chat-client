// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/*
 *  Client-socket initialization 
 */

let net = require('net');

let client = new net.Socket({
    readable: true,
    writable: true
});

/* 
 *   DOM events
 */

function getMsg(bytes) {
    let chars = [];

    for (let i = 0; i < bytes.length; i++) {
        chars.push( String.fromCharCode(bytes[i]) );
    }

    let string = chars.join('');
    return string;
}

function sendMessage() {
    let msg = document.getElementById('msgTextArea').value;

    if (msg.trim() == '') {
        return;
    }

    client.connect(25565, '127.0.0.1', function() {
        if (client.write(client.write(String(msg)))) {
            console.log('sent succesfully ', msg);
        } else {
            console.log('failed to send ', msg);
        }
    });

    document.getElementById('msgTextArea').value = '';
}

function lastUserBlock() {
    $('.userBlock:last .chatRightSide .')
}

window.onkeyup = function(e) {
    // Enter
    if (e.keyCode == 13) {
        sendMessage();
    }
}

/*
 *   Client
 */

client.connect(25565, '127.0.0.1', function() {
    console.log('connected vrode...');
    client.write('Hello, server!');

    client.setKeepAlive(true);
});


client.on('data', function(data) {
    console.log('Received: ', data);
    let msg = getMsg(data);
    //alert('Received(msg): ' + msg);

    var newMessageContent = document.createElement('span');
    newMessageContent.className = 'messageContent';
    newMessageContent.innerHTML = msg;

    $('.userBlock:last-child').find('.chatRightSide:last-child').append(newMessageContent);
});

client.on('error', function(error) {
    console.log(error.message);
    //alert(error.message);
});

client.on('close', function() {
    console.log('disconnected vrode...');
});