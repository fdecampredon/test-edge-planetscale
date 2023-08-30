import { connect } from "@planetscale/database";

const username = "bcq3btlne8z70f63tohv";
const host = "aws.connect.psdb.cloud";
const password = "pscale_pw_hAzbP29wcMkuafjfOpji4J8VA5naB3HMAidgFA3AE5d";

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
