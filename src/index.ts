import Block from "./components/block";
import Blockchain from "./components/blockchain";

const blockchain = new Blockchain();
blockchain.add({ data: "initial" });

let prevTimestamp, nextTimestamp, nextBlock: Block, timeDiff, average;

const times: number[] = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.last.timestamp;
  blockchain.add({ data: `block ${i}` });
  nextBlock = blockchain.last;
  nextTimestamp = blockchain.last.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  average = times.reduce((prev, time) => prev + time, 0) / times.length;

  console.log(
    `Time to mine: ${timeDiff}ms | Difficulty: ${nextBlock.difficulty} | Average Time: ${average}ms.`
  );
}
