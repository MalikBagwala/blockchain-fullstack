## Blockchain full stack

1. Nonce Number - A **random value added to the hashing function** to crack the hash which satisfies the difficulty (no of leading zeros in a hash)

2. Difficulty - A number which represents number of leading zeros required in an acceptable hash. This is needed to make the proof of work more challenging and maintain the rate of mining.

3. Rate Of Mining - It determines the time interval between subsequently mined blocks. A mine rate of `1000` means. **Only 1 block should be mined per second (1000ms)**

4. Binary output (256 characters) of the **SHA256** offers more flexibility than hex ( 64 characters) in terms of adjusting the difficulty since it comprises of only 1s and 0s. (ps. this is also what bitcoin uses :D )

5. Proof of work (PoW) is a decentralized consensus mechanism that requires members of a network to expend effort solving an arbitrary mathematical puzzle to prevent anybody from gaming the system.