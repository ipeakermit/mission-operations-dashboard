import ioclient from 'socket.io-client';

const endpoint = process.env.REACT_APP_SOCKET_ENDPOINT || 'http://127.0.0.1:4001';
const socket = ioclient(endpoint, { transports: ['websocket']});

export default socket;