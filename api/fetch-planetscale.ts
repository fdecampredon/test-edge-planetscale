import { connect } from "@planetscale/database";

const username = "z87vy349nxi78yr8dbk3";
const host = "aws.connect.psdb.cloud";
const password = "pscale_pw_77Ofva0oGUF1z3ZPn0tZbJ3YqlPsYgLZb9gRQOnzXe4";

const testConcurrentFetchPlanetScale = async (req: Request) => {
  let currentNbFetch = 0;
  let concurrentFetch = 0;
  const fetchFunc = async (input: RequestInfo | URL, init?: RequestInit) => {
    currentNbFetch++;
    if (nbFetch > concurrentFetch) {
      concurrentFetch = nbFetch;
    }
    try {
      return await fetch(input, init);
    } finally {
      currentNbFetch--;
    }
  };

  const config = {
    host: host,
    username: username,
    password: password,
    fetch: fetchFunc,
  };

  const nbFetch = parseInt(
    new URL(req.url).searchParams.get("nbFetch") ?? "10",
    10
  );
  console.log("nbFetch", nbFetch);
  try {
    await Promise.all(
      Array.from({ length: nbFetch }).map(async () => {
        const conn = connect(config);
        await conn.execute("select * from Profile limit 1");
      })
    );

    console.log("ok with concurrent fetch : ", concurrentFetch);
    return new Response("ok");
  } catch (error) {
    console.error(error, "error with concurrent fetch : ", concurrentFetch);
    return new Response(error.message, { status: 500 });
  }
};

export default testConcurrentFetchPlanetScale;

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};
