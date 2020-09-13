import * as amqp from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib';
import { BINDING_KEY_DIRECT, DIRECT_QUEUE, DIRECT_EXCHANGE } from '../constants';

const connection = amqp.connect(['amqp://localhost']);


function consumer(connection) {
    connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
           return await Promise.all([
                channel.bindQueue(DIRECT_QUEUE, DIRECT_EXCHANGE, BINDING_KEY_DIRECT),
                channel.consume(DIRECT_QUEUE , directMessageHandler , { noAck: true})
            ])
    
        }
    });
}

const directMessageHandler = (message) => {
    console.log(Buffer.from(message.content).toString())
}
consumer(connection)