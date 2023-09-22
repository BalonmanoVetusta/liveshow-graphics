import NodeCG from "@nodecg/types";

export async function autoStats(nodecg: NodeCG.ServerAPI) {
  const router = nodecg.Router();
  router.get("/", (req, res) => {
    return res.json({ message: "Hello world!" });
  });

  // TODO: Implement auto-stats

  nodecg.mount(`/${nodecg.bundleName}/auto-stats`, router);
}
