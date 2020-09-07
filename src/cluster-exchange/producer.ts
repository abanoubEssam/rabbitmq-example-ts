import { ConfirmChannel } from "amqplib";
import { DIRECT_EXCHANGE, ROUTE_KEY_DIRECT, DIRECT_QUEUE, ExchangesTypes } from '../constants';
import * as amqp from 'amqp-connection-manager'
const connection = amqp.connect(['amqp://localhost']);

let messageCount = 15;
let count = 1



async function produce(connection) {
    await connection.createChannel({
        json: true,
        setup: async function (channel: ConfirmChannel) {
            return await Promise.all([
                assertExchange(channel),
                assertQueue(channel),
                bindingQueue(channel),
                publish(channel),
            ])
        }
    });
}

const assertExchange = (channel:ConfirmChannel) => {
    channel.assertExchange(DIRECT_EXCHANGE, ExchangesTypes.DIRECT);
};

const assertQueue = (channel:ConfirmChannel) => {
    channel.assertQueue(DIRECT_QUEUE, { durable: false, messageTtl: 6000 });
};

const bindingQueue = (channel:ConfirmChannel) => {
    channel.bindQueue(DIRECT_QUEUE, DIRECT_EXCHANGE, ROUTE_KEY_DIRECT);
};

const publish =  (channel:ConfirmChannel) =>{
    channel.publish(DIRECT_EXCHANGE, ROUTE_KEY_DIRECT, Buffer.from(JSON.stringify({ message: "DIRECT MSG From Producer" })));
}


console.log("BEFORE");
produce(connection)
console.log("SUCCESS")