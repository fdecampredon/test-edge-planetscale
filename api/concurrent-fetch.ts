import { connect } from "@planetscale/database";

const username = "z87vy349nxi78yr8dbk3";
const host = "aws.connect.psdb.cloud";
const password = "pscale_pw_77Ofva0oGUF1z3ZPn0tZbJ3YqlPsYgLZb9gRQOnzXe4";



const testConcurrentFetch = async (req: Request) => {
  const config = {
    host: host,
    username: username,
    password: password,
  };

  const nbFetch = parseInt(
    new URL(req.url).searchParams.get("nbFetch") ?? "10",
    10
  );
  console.log('nbFetch', nbFetch)
  try {
    await Promise.all(
      Array.from({
        length: nbFetch,
      }).map(async () => {
        const conn = connect(config);
        await conn.execute("select * from Profile limit 1");
      })
    );

    console.log("ok");
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
