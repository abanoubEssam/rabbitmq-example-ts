import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { ExchangesTypes } from '../constants';

const connection = amqp.connect(['amqp://localhost']);



async function producer(connection) {
    await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
            return await Promise.all([
                    channel.assertExchange("developersExchangee",ExchangesTypes.FANOUT),
                  
                    channel.assertQueue("backendQ"),
                    channel.assertQueue("frontendQ"),
                    channel.assertQueue("mobileQ"),
                   
                    channel.bindQueue("backendQ","developersExchangee",""),
                    channel.bindQueue("frontendQ","developersExchangee",""),
                    channel.bindQueue("mobileQ","developersExchangee",""),
                   
                    channel.publish("developersExchangee","",Buffer.from(JSON.stringify({message:"Hello"})) , {persistent: true}),
            ])

        }
    });
}

console.log("start");
producer(connection);
console.log("end");
