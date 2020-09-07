import * as amqp from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib';

const connection = amqp.connect(['amqp://localhost']);


function consumer(connection) {
    connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
           return await Promise.all([

                channel.bindQueue("abanoubQ", "developersExtchangeTopic", "dev.abanoub.*"),
                channel.bindQueue("ramyQ", "developersExtchangeTopic", "dev.ramy.#"),

                channel.consume("ramyQ" , ramyMessageHandler , { noAck: true}),
                channel.consume("abanoubQ" , abanoubMessageHandler , { noAck: true}),
            ])
    
        }
    });
}

const ramyMessageHandler = (message) => {
    console.log("rQ", Buffer.from(message.content).toString())
}
const abanoubMessageHandler = (message) => {
    console.log("aQ" , Buffer.from(message.content).toString())
}

consumer(connection)