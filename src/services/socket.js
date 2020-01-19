import socketio from 'socket.io-client';

const url = 'http://192.168.0.27:3333';
const socket = socketio(url, {
    autoConnect: false
});

function subscribeToNewDevs(callbackFunction){
    socket.on('new-dev',callbackFunction);
}

function connect(opts) {
    socket.io.opts.query = opts;
    socket.connect();
}

function disconnect() {
    if(socket.connected){
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs
};
