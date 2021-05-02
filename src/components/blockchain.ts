import cryptoHash from "../utils/hash.utils";
import Block from "./block";

class Blockchain {
  private chainArray: Block[];
  constructor() {
    this.chainArray = [Block.genesis()];
  }

  /**
   *
   * @returns Last block of the chain
   */
  get last() {
    return this.chainArray[this.chainArray.length - 1];
  }

  /**
   *
   * @returns First Block of the chain
   */
  get first() {
    return this.chainArray[0];
  }

  /**
   * Adds block to the chain
   */
  add({ data }) {
    const newBlock = Block.mineBlock({ lastBlock: this.last, data });
    this.chainArray.push(newBlock);
  }

  get chain() {
    return this.chainArray;
  }

  static checkChainValidity(chain: Block[]) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (Math.abs(lastBlock.difficulty - block.difficulty) > 1) return false;
      if (block.lastHash !== lastBlock.hash) return false;

      const computedHash = cryptoHash(
        block.data,
        block.lastHash,
        block.difficulty,
        block.nonce,
        block.timestamp
      );
      if (computedHash !== block.hash) return false;
    }
    return true;
  }

  replace(chain: Block[]) {
    if (chain.length <= this.chainArray.length) {
      console.error("New chain has to be longer than the existing chain");
      return;
    }
    if (!Blockchain.checkChainValidity(chain)) {
      console.error("New chain must be valid");
      return;
    }
    this.chainArray = chain;
  }
}

export default Blockchain;
