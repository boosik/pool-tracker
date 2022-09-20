import WebSocket from 'ws';
import Worker from "worker_threads";

export const webSocket = new WebSocket("wss://rpc-osmosis.blockapsis.com/websocket")

console.log('start');

webSocket.on('open', function open() {
    console.log('websocket opened...');
    webSocket.send(JSON.stringify({
        "method": "subscribe",
        "params": ["tm.event='Tx' AND message.action='/osmosis.gamm.v1beta1.MsgSwapExactAmountIn'"],
        "id": "1",
        "jsonrpc": "2.0"
    }));
});

webSocket.on('close', function close() {
    console.log('websocket close...');
});

webSocket.on('message', async function incoming(data) {
    console.log('on message');
    const worker = new Worker.Worker('./app/service.js', { workerData: {data: data} });
    worker.on("message", (data) => {

    });
});
