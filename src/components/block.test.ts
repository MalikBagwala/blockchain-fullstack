import GENESIS_DATA, { MINE_RATE } from "../config";
import cryptoHash, { checkDifficulty } from "../utils/hash.utils";
import Block from "./block";

describe("Block", () => {
  const data = {
    name: "Malik Bagwala",
  };
  const lastHash = "12345";
  const hash = "12341";
  const nonce = 1;
  const difficulty = 1;
  const timestamp = 2000;
  const block = new Block({
    data,
    lastHash,
    hash,
    nonce,
    difficulty,
    timestamp,
  });
  it("Block has all the valid properties", () => {
    expect(block.timestamp).toBeDefined();
    expect(block.hash).toBeDefined();
    expect(block.nonce).toBeDefined();
    expect(block.difficulty).toBeDefined();
    expect(block.lastHash).toBeDefined();
  });

  describe("adjustDifficulty()", () => {
    it("raises difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty(block, timestamp + MINE_RATE - 100)
      ).toEqual(block.difficulty + 1);
    });
    it("lowers difficulty for a slowly mined block", () => {
      expect(
        Block.adjustDifficulty(block, timestamp + MINE_RATE + 100)
      ).toEqual(block.difficulty - 1);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("Creates proper hash based on SHA-256", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("Sets lastHash to the hash of last Block", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("Sets a `hash` that matches the difficulty criteria", () => {
      expect(checkDifficulty(minedBlock.hash, minedBlock.difficulty)).toEqual(
        true
      );
    });

    it("Adjusts difficulty", () => {
      const possibleDifficulties = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];
      expect(possibleDifficulties.includes(minedBlock.difficulty)).toBe(true);
    });

    it("Has a lower limit of 1", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty(block, 123)).toEqual(1);
    });
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();

    it("Instance of a block", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it("Gensis block has proper config", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
});
