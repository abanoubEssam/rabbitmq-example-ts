import { ConfirmChannel } from "amqplib";
import { DIRECT_EXCHANGE, ROUTE_KEY_DIRECT, DIRECT_QUEUE, ExchangesTypes, BINDING_KEY_DIRECT } from '../constants';
import * as amqp from 'amqp-connection-manager'
const connection = amqp.connect(['amqp://localhost']);


console.log("BEFORE");

const channelWrapper = connection.createChannel({
    json: true,
    setup: async function (channel: ConfirmChannel) {
        await assertExchange(channel);
        await assertQueue(channel);
        await bindingQueue(channel);
    }
});

const assertExchange = async (channel: ConfirmChannel) => {
    return await Promise.all([
        channel.assertExchange(DIRECT_EXCHANGE, ExchangesTypes.DIRECT),
        channel.assertExchange("deadLetterExtchange1", ExchangesTypes.DIRECT)
    ])
};

const assertQueue = (channel: ConfirmChannel) => {
    channel.assertQueue("DIRECT_QUEUE2", { durable: false, messageTtl: 30000, deadLetterExchange: "deadLetterExtchange1" ,deadLetterRoutingKey: "ROUTE_KEY_DIRECT2" });
    channel.assertQueue("DIRECT_QUEUE3", { durable: false });
};

const bindingQueue = (channel: ConfirmChannel) => {
    channel.bindQueue("DIRECT_QUEUE2", DIRECT_EXCHANGE, BINDING_KEY_DIRECT);
    channel.bindQueue("DIRECT_QUEUE3", "deadLetterExtchange1", "ROUTE_KEY_DIRECT2");
};

channelWrapper.publish(DIRECT_EXCHANGE, ROUTE_KEY_DIRECT, { message: "DIRECT MSG From Producer" });

console.log("SUCCESS")