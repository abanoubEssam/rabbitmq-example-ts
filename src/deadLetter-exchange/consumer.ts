import * as amqp from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib';
import { BINDING_KEY_DIRECT, DIRECT_QUEUE, DIRECT_EXCHANGE } from '../constants';

const connection = amqp.connect(['amqp://localhost']);


function consumer(connection) {
    connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
                await consume(channel, directMessageHandler);
                await newConsume(channel , deadLetterMessageHandler)
        }
    });
}


const consume = async (channel: ConfirmChannel, handler) => {

    await new Promise(resolve => {
        setTimeout(resolve, 40000);
    });
    console.log("Died")
    channel.consume("DIRECT_QUEUE2", handler, { noAck: true })
}

const newConsume = async (channel: ConfirmChannel, handler) => {
    console.log("NEW CONSUME")
    channel.consume("DIRECT_QUEUE3", handler, { noAck: true })
}

const directMessageHandler = (message) => {
    console.log("MESSAGE: " , Buffer.from(message.content).toString())
}

const deadLetterMessageHandler = (message) => {
    console.log("DEAD MESSAGE RESOLVER: " , Buffer.from(message.content).toString())
}

consumer(connection)