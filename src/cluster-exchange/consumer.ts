const q = 'tasks';
import * as amqp from 'amqp-connection-manager';

const connection = amqp.connect([
    'amqp://localhost:5672',
    'amqp://localhost:5673',
    'amqp://localhost:5675'
]);

let consumer = async () => {

    var channelWrapper = connection.createChannel({
        json: true,
        setup: function (channel) {
            return channel.assertQueue(q, { durable: true });
        }
    });

    channelWrapper.addSetup(function (channel) {
        return Promise.all([
            channel.consume(q, (msg) => {
                console.log(msg.content.toString())
            }, { noAck: true, exclusive: false })
        ])
    });
}

consumer()
