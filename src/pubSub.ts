import redis, { RedisClient } from "redis";
import Blockchain from "./components/blockchain";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};
class PubSub {
  blockchain: Blockchain;
  subscriber: RedisClient;
  publisher: RedisClient;

  constructor({ blockchain }) {
    console.log("PUBSUB constructor called", blockchain);

    this.blockchain = blockchain;
    this.subscriber = redis.createClient();
    this.publisher = redis.createClient();
    this.subscribeToChannels();

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }
  handleMessage(channel: string, message: string) {
    console.log(this.blockchain);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        const parsedChain = JSON.parse(message);
        console.log(parsedChain, "PARSED CHAIN");

        this.blockchain?.replace(parsedChain);
        return;

      default:
        return;
    }
  }
  subscribeToChannels() {
    for (const channel in CHANNELS) {
      this.subscriber.subscribe(CHANNELS[channel]);
    }
  }
  broadcastBlockchain() {
    this.subscriber.unsubscribe(CHANNELS.BLOCKCHAIN, () => {
      this.publisher.publish(
        CHANNELS.BLOCKCHAIN,
        JSON.stringify(this.blockchain.chain),
        () => {
          this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
        }
      );
    });
  }
}

export default PubSub;
