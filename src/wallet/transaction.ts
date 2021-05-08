import { randomBytes } from "crypto";
import { ec } from "elliptic";
import Wallet from ".";
import { verifySignature } from "../utils/elliptic.utils";

interface OutputMapType {
  [key: string]: number;
}

export interface TransactionInitType {
  senderWallet: Wallet;
  recieverPublicKey: string;
  amount: number;
}

export interface TransactionInputType {
  timestamp: number;
  amount: number;
  address: string;
  signature: ec.Signature;
}
class Transaction {
  id: string;
  outputMap: OutputMapType;
  input: TransactionInputType;
  constructor(input: TransactionInitType) {
    this.id = randomBytes(16).toString("hex");
    this.outputMap = this.generateOutputMap(input);
    this.input = this.generateInput(input.senderWallet);
  }

  generateOutputMap(input: TransactionInitType) {
    const { senderWallet, recieverPublicKey, amount } = input;
    return {
      [senderWallet.publicKey]: senderWallet.balance - amount,
      [recieverPublicKey]: amount,
    };
  }

  generateInput(senderWallet: Wallet): TransactionInputType {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(this.outputMap),
    };
  }

  static validateTransaction(transaction: Transaction) {
    const {
      outputMap,
      input: { address, amount, signature },
    } = transaction;

    const total = Object.values(outputMap).reduce((t, item) => t + item, 0);
    if (total !== amount) {
      return false;
    }
    if (!verifySignature({ publicKey: address, signature, data: outputMap })) {
      return false;
    }
    return true;
  }
}

export default Transaction;
