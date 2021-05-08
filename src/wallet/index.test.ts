import Wallet from ".";
import { verifySignature } from "../utils/elliptic.utils";

describe("wallet", () => {
  let wallet: Wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  describe("has proper fields", () => {
    it("has a `balance`", () => {
      expect(wallet).toHaveProperty("balance");
    });

    it("has a `keyPair`", () => {
      expect(wallet).toHaveProperty("keyPair");
    });
  });

  describe("verifySignature", () => {
    const data = "foobar";
    it("verifies signature with proper keys", () => {
      expect(
        verifySignature({
          data,
          publicKey: wallet.publicKey,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });
    it("invalidates signature with misconfigures data", () => {
      expect(
        verifySignature({
          data,
          publicKey: wallet.publicKey,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });
});
