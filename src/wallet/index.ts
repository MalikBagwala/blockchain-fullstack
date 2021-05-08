import { WALLET_BALANCE } from "../config";
import { ecInstance } from "../utils/elliptic.utils";
import { ec } from "elliptic";
import cryptoHash from "../utils/hash.utils";
class Wallet {
  balance: number;
  keyPair: ec.KeyPair;

  constructor() {
    this.balance = WALLET_BALANCE;
    this.keyPair = ecInstance.genKeyPair();
  }

  sign(data: any) {
    return this.keyPair.sign(cryptoHash(data));
  }

  get publicKey() {
    return this.keyPair.getPublic().encode("hex", true);
  }
}

export default Wallet;
