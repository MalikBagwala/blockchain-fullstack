import GENESIS_DATA, { MINE_RATE } from "../config";
import cryptoHash, { checkDifficulty } from "../utils/hash.utils";

class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: any;
  nonce: number;
  difficulty: number;
  constructor({
    hash,
    data,
    lastHash,
    timestamp = Date.now(),
    nonce,
    difficulty,
  }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mineBlock({ lastBlock, data }) {
    let timestamp: number, hash: string, difficulty: number;
    const lastHash = lastBlock.hash;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = cryptoHash(lastHash, timestamp, data, nonce, difficulty);
    } while (!checkDifficulty(hash, difficulty));

    // const timestamp = Date.now();
    return new this({
      lastHash,
      timestamp,
      data,
      difficulty,
      nonce,
      hash,
    });
  }

  static adjustDifficulty(block: Block, timestamp: number) {
    if (block.difficulty < 1) return 1;
    if (timestamp - block.timestamp <= MINE_RATE) {
      return block.difficulty + 1;
    }
    return block.difficulty - 1;
  }
}

export default Block;
