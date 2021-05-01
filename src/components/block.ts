import GENESIS_DATA from "../config";
import cryptoHash from "../utils/hash.utils";

class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: any;
  constructor({ hash, data, lastHash, timestamp = Date.now() }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mineBlock({ lastBlock, data }) {
    const lastHash = lastBlock.hash;
    const timestamp = Date.now();
    return new this({
      lastHash,
      timestamp,
      data,
      hash: cryptoHash(lastHash, timestamp, data),
    });
  }
}

export default Block;
