import Wallet from ".";
import { verifySignature } from "../utils/elliptic.utils";
import Transaction from "./transaction";

describe("Transaction", () => {
  let senderWallet: Wallet,
    amount: number,
    recieverPublicKey: string,
    transaction: Transaction;

  beforeEach(() => {
    senderWallet = new Wallet();
    recieverPublicKey = new Wallet().publicKey;
    amount = 50;
    transaction = new Transaction({ senderWallet, recieverPublicKey, amount });
  });

  it("has `id`,`input`,`outputMap`", () => {
    expect(transaction).toHaveProperty("id");
    expect(transaction).toHaveProperty("input");
    expect(transaction).toHaveProperty("outputMap");
  });

  it("outMap updated output correctly", () => {
    expect(transaction.outputMap[recieverPublicKey]).toEqual(amount);
    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
      senderWallet.balance - amount
    );
  });

  describe("input", () => {
    it("has a `timestamp` field", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });
    it("sets the `amount` to the `senderWallet` balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the `address` to the `senderWallet` publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("signs the input", () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  // describe("validTransaction()", () => {
  //   it("is valid transaction", () => {
  //     expect(Transaction.validateTransaction(transaction)).toEqual(true);
  //   });

  //   describe("is invalid transaction", () => {
  //     // it("has misconfigured amount", () => {
  //     //   expect(Transaction.validateTransaction(transaction)).toEqual(false);
  //     // });
  //   });
  // });
});
