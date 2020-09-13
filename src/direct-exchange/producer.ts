import { ConfirmChannel } from "amqplib";
import { DIRECT_EXCHANGE, ROUTE_KEY_DIRECT, DIRECT_QUEUE, ExchangesTypes } from '../constants';
import * as amqp from 'amqp-connection-manager'
const connection = amqp.connect(['amqp://localhost']);


async function produce(connection) {
    await connection.createChannel({
        json: true,
        setup: async function (channel: ConfirmChannel) {
            return await Promise.all([
                channel.assertExchange(DIRECT_EXCHANGE, ExchangesTypes.DIRECT),
                channel.assertQueue(DIRECT_QUEUE, { durable: false }),
                // channel.bindQueue(DIRECT_QUEUE, DIRECT_EXCHANGE, ROUTE_KEY_DIRECT),
                channel.publish(DIRECT_EXCHANGE, ROUTE_KEY_DIRECT, Buffer.from(JSON.stringify({ message: "DIRECT MSG From Producer" }))),

                // also i can sent message to specific queue without routing key
                // channel.sendToQueue(
                //     DIRECT_QUEUE,
                //     Buffer.from(JSON.stringify({ message: "DIRECT MSG From Producer" })),
                //     { persistent: true })
            ])
        }
    });
}
console.log("BEFORE");
produce(connection)
console.log("SUCCESS")