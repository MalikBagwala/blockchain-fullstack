import GENESIS_DATA from "../config";
import cryptoHash from "../utils/hash.utils";
import Block from "./block";

describe("Block", () => {
  const data = {
    name: "Malik Bagwala",
  };
  const lastHash = "12345";
  const hash = "12341";

  const block = new Block({ data, lastHash, hash });
  it("generate a timestamp", () => {
    expect(block.timestamp).toBeDefined();
  });
});

describe("Genesis Block", () => {
  const genesisBlock = Block.genesis();

  it("Instance of a block", () => {
    expect(genesisBlock instanceof Block).toBe(true);
  });
  it("Gensis block has proper config", () => {
    expect(genesisBlock).toEqual(GENESIS_DATA);
  });
});

describe("Mined Block", () => {
  const lastBlock = Block.genesis();
  const data = "mined data";
  const minedBlock = Block.mineBlock({ lastBlock, data });

  it("Creates proper hash based on SHA-256", () => {
    expect(minedBlock.hash).toEqual(
      cryptoHash(minedBlock.timestamp, lastBlock.hash, data)
    );
  });

  it("Sets lastHash to the hash of last Block", () => {
    expect(minedBlock.lastHash).toEqual(lastBlock.hash);
  });
});
