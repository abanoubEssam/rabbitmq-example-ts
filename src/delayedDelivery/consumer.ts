
import * as amqp from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib";

async function consume() {
    const connection = await amqp.connect([
        "amqp://localhost"
    ]);

    const channelWrapper = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
            channel.consume("WORKING_QUEUE", handleDeadMessage);
        }
    });


    const handleDeadMessage = (message: ConsumeMessage) => {
        let content: any = Buffer.from(message.content).toString();
        console.log("Dead Message Received ", content);

        content = JSON.parse(content);
        try {
            if (content.attempt && content.attempt == 3) {
                channelWrapper.ack(message);
                console.log("MessaggeHandled");
                return;
            }

            throw new Error("Fucken error On Handle Dead Message");
        } catch (e) {
            delayedDelivery(message);
        }
    }

    const delayedDelivery = async (message: ConsumeMessage) => {
        channelWrapper.ack(message);

        let content: any = Buffer.from(message.content).toString();
        content = JSON.parse(content);
        let attempt = ++content.attempt || 1

        if (attempt <= 3) {
            content.attempt = attempt;
            let routingKey = `retry-${attempt}`;
            await channelWrapper.publish("TTL_EXCHANGE", routingKey, content);
            return;
        }

        console.log("Failed Handle Delayed Message")

    }


}

consume();