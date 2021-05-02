import crypto from "crypto";
import hexToBinary from "hex-to-binary";
function cryptoHash(...input) {
  const hash = crypto.createHash("sha256");
  hash.update(input.sort().join(" "));
  return hash.digest("hex");
}

export function checkDifficulty(hash: string, difficulty: number) {
  return hexToBinary(hash).substring(0, difficulty) === "0".repeat(difficulty);
}
export default cryptoHash;
