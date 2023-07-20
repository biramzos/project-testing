const amqp = require("amqplib");

class Service {
    channel;

    async create() {
        const connection = await amqp.connect("amqp://localhost");
        this.channel = await connection.createChannel();
    }

    async send(message) {
        if (!this.channel) {
            await this.create();
        }
        await this.channel.assertExchange("MESSAGES", "direct");
        const queue = await this.channel.assertQueue("MessagesQueue");
        await this.channel.bindQueue(queue.queue, "MESSAGES", message);
        this.channel.consume(queue.queue, (msg) => {
            this.channel.ack(msg);
            console.log(JSON.parse(msg.content));
        });
    }
}

module.exports = Service;
