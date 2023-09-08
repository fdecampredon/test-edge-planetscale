import { connect } from "@planetscale/database";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// @ts-ignore
const username = process.env.PLANETSCALE_USERNAME;
const host = "aws.connect.psdb.cloud";
// @ts-ignore
const password = process.env.PLANETSCALE_PASSWORD;

const testConcurrentFetchPlanetScale = async  (
  req: VercelRequest,
  response: VercelResponse
) => {
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
    response.status(200).send("ok");
  } catch (error) {
    console.error(error, "error with concurrent fetch : ", concurrentFetch);
    response.status(500).send(error.message);
  }
};

export default testConcurrentFetchPlanetScale;
