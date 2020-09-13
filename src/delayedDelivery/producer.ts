
import * as amqp from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";

function assertExchanges(channel: ConfirmChannel) {
    return Promise.all([
        channel.assertExchange("WORKING_EXCHANGE", "fanout"),
        channel.assertExchange("TTL_EXCHANGE", "direct"),
        channel.assertExchange("DeadLetterExtchange", "fanout")
    ]);
}

function assertQueues(channel: ConfirmChannel) {
    return Promise.all([

        channel.assertQueue("WORKING_QUEUE"),

        channel.assertQueue("Q1-10s", { messageTtl: 10000, deadLetterExchange: "DeadLetterExtchange" }),
        channel.assertQueue("Q2-40s", { messageTtl: 40000, deadLetterExchange: "DeadLetterExtchange" }),
        channel.assertQueue("Q3-60s", { messageTtl: 60000, deadLetterExchange: "DeadLetterExtchange" })

    ]);

}

function bind(channel: ConfirmChannel) {
    return Promise.all([

        channel.bindQueue("WORKING_QUEUE", "WORKING_EXCHANGE", ""),

        channel.bindQueue("Q1-10s", "TTL_EXCHANGE", "retry-1"),
        channel.bindQueue("Q2-40s", "TTL_EXCHANGE", "retry-2"),
        channel.bindQueue("Q3-60s", "TTL_EXCHANGE", "retry-3"),
        channel.bindQueue("WORKING_QUEUE", "DeadLetterExtchange", "")
    ]);
}

async function produce() {
    const connection = await amqp.connect([
        "amqp://localhost"
    ]);

    const channelWrapper = connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
            await assertExchanges(channel);
            await assertQueues(channel);
            await bind(channel);
        }
    });

    console.log("Before sending");
    try {
        await channelWrapper.publish(
            "WORKING_EXCHANGE",
            "",
            {
                message: "Dead Message"
            },
            {
                persistent: true,
            }
        );
    }
    catch (error) {
        console.log("produce -> error", error)
    }

    console.log("After sending");
    await channelWrapper.close();
    await connection.close();
}

produce();