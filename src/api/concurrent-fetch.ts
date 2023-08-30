import { connect } from "@planetscale/database";

const username = "izolmz0stzi5geoclkfv";
const host = "aws.connect.psdb.cloud";
const password = "pscale_pw_XSAFzBqmJhn6YjnCeOi41ftQJsLTSuM1AZSjg2eIfsZ";

export default async (req: Request) => {
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
    return new Response(error.message, { status: 500 });
  }
};

export const config = {
  runtime: "edge",
  regions: "fra1",
};
