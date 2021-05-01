import crypto from "crypto";
function cryptoHash(...input) {
  const hash = crypto.createHash("sha256");
  hash.update(input.sort().join(" "));
  return hash.digest("hex");
}

export default cryptoHash;
