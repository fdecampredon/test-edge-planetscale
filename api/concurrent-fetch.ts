import { connect } from "@planetscale/database";

const username = "ixrzs0n4iuoifdupw07t";
const host = "aws.connect.psdb.cloud";
const password = "pscale_pw_qgxab2LtpjTW3L5wowTNac2zf3A6PHeQy062ZIDy3z8";

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
        await conn.execute("select * from Profile limit 1");
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
