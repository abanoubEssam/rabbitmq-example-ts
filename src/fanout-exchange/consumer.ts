import * as  amqp from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib';
import { FANOUT_EXCHANGE, FANOUT_QUEUE } from '../constants';

const connection = amqp.connect(['amqp://localhost']);


async function consumer(connection) {
    await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
            return await Promise.all([
                
                // also i can bind here 
                // channel.bindQueue("backendQ","developersExchangee",""),
                // channel.bindQueue("frontendQ","developersExchangee",""),
                // channel.bindQueue("mobileQ","developersExchangee",""),

                channel.consume("backendQ" , directMessageHandler , { noAck: true}),
                channel.consume("frontendQ" , directMessageHandler2 , { noAck: true}),
                channel.consume("mobileQ" , directMessageHandler3 , { noAck: true}),
            ])

        }
    });
}

const directMessageHandler = (message) => {
    console.log("Hi back enders ", Buffer.from(message.content).toString())
}

const directMessageHandler2 = (message) => {
    console.log("Hi front enders", Buffer.from(message.content).toString())
}

const directMessageHandler3 = (message) => {
    console.log("Hi mobile developers", Buffer.from(message.content).toString())
}
consumer(connection)