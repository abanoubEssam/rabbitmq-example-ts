import { ConfirmChannel } from "amqplib";
import { ExchangesTypes } from '../constants';
const amqp = require('amqp-connection-manager');
const connection = amqp.connect(['amqp://localhost']);

async function produce(connection) {
    await connection.createChannel({
        json: true,
        setup: async function (channel: ConfirmChannel) {
            return await Promise.all([

                channel.assertExchange("developersExtchangeTopic", ExchangesTypes.TOPIC),

                channel.assertQueue("abanoubQ", { durable: true }),
                channel.assertQueue("ramyQ", { durable: true }),

                channel.publish("developersExtchangeTopic","dev.ramy.nodejs.microservise",Buffer.from(JSON.stringify({message:"Hello ramy"})) , {persistent: true}),
                channel.publish("developersExtchangeTopic","dev.abanoub.mongodb",Buffer.from(JSON.stringify({message:"Hello abanoub"})) , {persistent: true}),

            ])
        }
    });
}
console.log("BEFORE");
produce(connection)
console.log("SUCCESS")