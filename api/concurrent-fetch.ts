import { connect } from "@planetscale/database";

const username = "y62z74krmyu38havxgmw";
const host = "aws.connect.psdb.cloud";
const password = "pscale_pw_YzwnlPydOkf9HnHvHCNsImvV7xxcU2XbHyah7pBwF6p";

const testConcurrentFetch = async (req: Request) => {
  const config = {
    host: host,
    username: username,
    password: password,
    fetch: globalThis.fetch,
  };

  const nbFetch = parseInt(
    new URL(req.url).searchParams.get("nbFetch") ?? "10"
  );
  try {
    await Promise.all(
      Array.from({
        length: nbFetch,
      }).map(async () => {
        const conn = connect(config);
        await conn.execute("select * from tests");
      })
    );

    return new Response("ok");
  } catch (error) {
    console.error(error, "error")
    return new Response(error.message, { status: 500 });
  }
};

export default testConcurrentFetch;

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};
