import axios from "axios";
import express from "express";
import Blockchain from "./components/blockchain";
import PubSub from "./pubSub";

const ROOT_NODE_PORT = 3000;
const ROOT_NODE_HOST = `http://localhost:${ROOT_NODE_PORT}`;
const app = express();
const blockchain = new Blockchain();
const pubSubBlockchain = new PubSub({ blockchain });
app.use(express.json());
app.get("/api/blockchain", (_, res) => {
  return res.json(blockchain.chain);
});

app.post("/api/mineblock", (req, res) => {
  if (req.body.data) {
    blockchain.add({ data: req.body.data });
    pubSubBlockchain.broadcastBlockchain();
    return res.redirect("/api/blockchain");
  }
  // res.send(200);
});

let PORT = ROOT_NODE_PORT;
if (parseInt(process.env.PEER || "0")) {
  PORT += Math.ceil(Math.random() * 1000);
}
console.log(PORT);

async function syncChain() {
  try {
    const res = await axios.get(`${ROOT_NODE_HOST}/api/blockchain`);
    if (res.status === 200) {
      blockchain.replace(res.data);
    }
  } catch (err) {
    console.log(`Cannot sync chains`, err);
  }
}
app.listen(PORT, () => {
  if (PORT !== ROOT_NODE_PORT) {
    syncChain();
  }
  `Server started on port ${PORT}`;
});
