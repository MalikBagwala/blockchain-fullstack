import { ec, ec as EC } from "elliptic";
import cryptoHash from "./hash.utils";

export const ecInstance = new EC("secp256k1");

export interface VerifySignatureInput {
  publicKey: string;
  data: any;
  signature: ec.Signature;
}
export const verifySignature = (input: VerifySignatureInput) => {
  const keyPair = ecInstance.keyFromPublic(input.publicKey, "hex");
  return ecInstance.verify(cryptoHash(input.data), input.signature, keyPair);
};
