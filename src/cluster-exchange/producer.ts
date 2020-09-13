let q = 'tasks';
import * as amqp from 'amqp-connection-manager';

const connection = amqp.connect([
    'amqp://localhost:5672',
    'amqp://localhost:5673',
    'amqp://localhost:5675'
]);

console.log("BEFORE");
const consumer = async () => {
    var channelWrapper = connection.createChannel({
        json: true,
        setup: function (channel) {
            return channel.assertQueue(q, { durable: true });
        }
    });

    console.log('Sending MEssage')
    await channelWrapper.sendToQueue(q, { value: "hey all" })
    console.log("DONE");
}
consumer()