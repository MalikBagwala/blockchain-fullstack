import cryptoHash from "../utils/hash.utils";
import Block from "./block";
import Blockchain from "./blockchain";

describe("Blockchain", () => {
  let blockchain: Blockchain;
  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain.add({ data: "Abbas Bagwala" });
    blockchain.add({ data: "Malik Bagwala" });
    blockchain.add({ data: "Huzefa Bagwala" });
  });
  it("Should start with a Genesis Block", () => {
    expect(blockchain.first).toEqual(Block.genesis());
  });

  it("Chain should be an array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("Successfully adds a block", () => {
    const data = "New Data";
    blockchain.add({ data });
    expect(blockchain.last.data).toEqual(data);
  });

  describe("Blockchain Validity", () => {
    it("Is the first block genesis block?", () => {
      expect(Blockchain.checkChainValidity(blockchain.chain)).toEqual(true);
    });

    it("Returns invalid when hash is tampered with", () => {
      blockchain.chain[1].hash = "tampered_hash";
      expect(Blockchain.checkChainValidity(blockchain.chain)).toEqual(false);
    });
    it("Returns invalid when data is tampered with", () => {
      blockchain.chain[1].timestamp = 1212121;
      expect(Blockchain.checkChainValidity(blockchain.chain)).toEqual(false);
    });
    it("Returns invalid when difficulty jumps by more than 1", () => {
      const lastBlock = blockchain.last;
      const lastHash = lastBlock.hash;
      const timestamp = Date.now();

      const nonce = 0;
      const data = [];
      const difficulty = lastBlock.difficulty - 3;
      const hash = cryptoHash(lastHash, timestamp, nonce, data, difficulty);

      const badBlock = new Block({
        lastHash,
        timestamp,
        nonce,
        data,
        difficulty,
        hash,
      });
      blockchain.chain.push(badBlock);
      expect(Blockchain.checkChainValidity(blockchain.chain)).toEqual(false);
    });
  });
});
describe("replaceChain()", () => {
  let blockchain: Blockchain;
  let originalChain: Block[];
  let newChain: Blockchain;
  let errorMock, logMock;
  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    errorMock = jest.fn();
    logMock = jest.fn();
    originalChain = blockchain.chain;
    global.console.error = errorMock;
    global.console.log = logMock;
  });

  it("Doesn't replace the chain if new chain is shorter or equal in length", () => {
    blockchain.replace(newChain.chain);
    expect(blockchain.chain).toEqual(originalChain);
  });
  it("Doesnt replace the chain is new chain is invalid", () => {
    newChain.add({ data: "Abcds" });
    newChain.chain[1].data = "asdsdasds";
    blockchain.replace(newChain.chain);

    expect(blockchain.chain).toEqual(originalChain);
  });
});
