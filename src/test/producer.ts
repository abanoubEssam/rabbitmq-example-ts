
import amqp from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import { TTL_EXCHANGE, WORKING_DLX, WORKING_EXCHANGE, WORKING_QUEUE } from "./constants";

function _assertExchanges(channel: ConfirmChannel) {
    return Promise.all([
        // channel.assertExchange(RAMY_EXCHANGE, "direct"),
        // channel.assertExchange(INDEX_EXCHANGE, "fanout"),
        // channel.assertExchange(PROGRAMMING_EXCHANGE,"topic")

        channel.assertExchange(WORKING_EXCHANGE, "fanout"),
        channel.assertExchange(WORKING_DLX, "fanout"),

        channel.assertExchange(TTL_EXCHANGE, "direct"),
        channel.assertExchange("DODO_DLX", "fanout")

    ]);
}

function _assertQueues(channel: ConfirmChannel) {
    return Promise.all([
        channel.assertQueue(WORKING_QUEUE),

        channel.assertQueue("work-retry-1-10s", { messageTtl: 10000, deadLetterExchange: "DODO_DLX" }),
        channel.assertQueue("work-retry-1-40s", { messageTtl: 40000, deadLetterExchange: "DODO_DLX" }),
        channel.assertQueue("work-retry-1-1m", { messageTtl: 60000, deadLetterExchange: "DODO_DLX" })
        
        // channel.assertQueue(RAMY_QUEUE),
        // channel.assertQueue(DIASTY_QUEUE),
        // channel.assertQueue(BEBO_QUEUE),
        // channel.assertQueue(BEHEIRY_QUEUE),
        // channel.assertQueue(KAREEM_QUEUE),
        // channel.assertQueue(SHABANA_QUEUE)
    ]);

}

function _bind(channel: ConfirmChannel) {
    return Promise.all([

        channel.bindQueue(WORKING_QUEUE, WORKING_EXCHANGE, ""),

        channel.bindQueue("work-retry-1-10s", TTL_EXCHANGE, "retry-1"),
        channel.bindQueue("work-retry-1-40s", TTL_EXCHANGE, "retry-2"),
        channel.bindQueue("work-retry-1-1m", TTL_EXCHANGE, "retry-3"),

        channel.bindQueue(WORKING_QUEUE,"DODO_DLX","")
        // channel.bindQueue(RAMY_QUEUE, RAMY_EXCHANGE, "ramy-task"),

        // channel.bindQueue(RAMY_QUEUE, INDEX_EXCHANGE, ""),
        // channel.bindQueue(DIASTY_QUEUE, INDEX_EXCHANGE, ""),
        // channel.bindQueue(BEBO_QUEUE, INDEX_EXCHANGE, ""),
        // channel.bindQueue(BEHEIRY_QUEUE, INDEX_EXCHANGE, ""),
        // channel.bindQueue(SHABANA_QUEUE, INDEX_EXCHANGE, ""),
        // channel.bindQueue(KAREEM_QUEUE, INDEX_EXCHANGE, ""),


        // channel.bindQueue(RAMY_QUEUE, PROGRAMMING_EXCHANGE, "pro.backend.*"),
        // channel.bindQueue(DIASTY_QUEUE, PROGRAMMING_EXCHANGE, "pro.rn.axios"),
        // channel.bindQueue(BEBO_QUEUE, PROGRAMMING_EXCHANGE, "pro.backend.mongo"),
        // channel.bindQueue(BEHEIRY_QUEUE, PROGRAMMING_EXCHANGE, "pro.ng.#"),
        // channel.bindQueue(SHABANA_QUEUE, PROGRAMMING_EXCHANGE , "pro.backend.swagger"),
        // channel.bindQueue(KAREEM_QUEUE, PROGRAMMING_EXCHANGE, "pro.#")
    ]);
}

async function produce() {
    const connection = await amqp.connect([
        "amqp://localhost"
    ]);


    const channelWrapper = connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
            await _assertExchanges(channel);
            await _assertQueues(channel);
            await _bind(channel);
        }
    });

    console.log("Before sending");
    await channelWrapper.publish(WORKING_EXCHANGE, "", { message: "New task" }, {
        persistent: true,
    });


    console.log("After sending");

    await channelWrapper.close();
    await connection.close();
}

produce();