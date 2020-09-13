
import amqp from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib";
import { TTL_EXCHANGE, WORKING_QUEUE } from "./constants";

function _assertQueues(channel: ConfirmChannel) {
    channel.assertQueue(WORKING_QUEUE);
    // channel.assertQueue(RAMY_QUEUE);
    // channel.assertQueue(DIASTY_QUEUE);
    // channel.assertQueue(BEBO_QUEUE);
    // channel.assertQueue(BEHEIRY_QUEUE);
    // channel.assertQueue(KAREEM_QUEUE);
    // channel.assertQueue(SHABANA_QUEUE);
}

async function consume() {
    const connection = await amqp.connect([
        "amqp://localhost"
    ]);


    const channelWrapper = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
            await channel.assertExchange(TTL_EXCHANGE, "direct");
            await _assertQueues(channel);
            channel.consume(WORKING_QUEUE, handleRamyMessage);
            // channel.consume(RAMY_QUEUE, handleRamyMessage);
            // channel.consume(BEBO_QUEUE, handleBeboMessage);
            // channel.consume(DIASTY_QUEUE, handleDiastyMessage);
            // channel.consume(BEHEIRY_QUEUE, handleBeheiryMessage);
            // channel.consume(SHABANA_QUEUE, handleShabanaMessage);
            // channel.consume(KAREEM_QUEUE, handleKmMesssafe);
        }
    });

    const handleDeadMessages = (message: ConsumeMessage) => {
        const content = Buffer.from(message.content).toString();
        console.log("Poison Message ", content);
        //channelWrapper.ack(message);
    }

    const handleRamyMessage = (message: ConsumeMessage) => {
        let content:any = Buffer.from(message.content).toString();
        console.log("Ramy received ,,, ", content);

        content = JSON.parse(content);
        try {
            if(content.attempt && content.attempt == 3){
               
                channelWrapper.ack(message);
                console.log("SUCESSSSSSSSSS");
                return;
            }

            throw new Error("Fucken error");
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
            await channelWrapper.publish(TTL_EXCHANGE, routingKey, content);
            return;
        }

        console.log("Failed bye bye")

    }

    const handleBeboMessage = (message: ConsumeMessage) => {
        const content = Buffer.from(message.content).toString();
        console.log("BEbo received ,,, ", content);
        channelWrapper.ack(message);

    }

    const handleDiastyMessage = (message: ConsumeMessage) => {
        const content = Buffer.from(message.content).toString();
        console.log("Diasty received ,,, ", content);
        channelWrapper.ack(message);

    }
    const handleBeheiryMessage = (message: ConsumeMessage) => {
        const content = Buffer.from(message.content).toString();
        console.log("Beheriryer received ,,, ", content);
        channelWrapper.ack(message);

    }
    const handleShabanaMessage = (message: ConsumeMessage) => {
        const content = Buffer.from(message.content).toString();
        console.log("Shabananananan received ,,, ", content);
        channelWrapper.ack(message);

    }
    const handleKmMesssafe = (message: ConsumeMessage) => {
        const content = Buffer.from(message.content).toString();
        console.log("KAreeeeem received ,,, ", content);
        channelWrapper.ack(message);

    }

}

consume();