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


  const nbFetch = parseInt(
    new URL(req.url).searchParams.get("nbFetch") ?? "10",
    10
  );
  console.log("nbFetch", nbFetch);
  try {
    await Promise.all(
      Array.from({ length: nbFetch }).map(async () => {
        await fetchFunc("https://test-vercel-perf.vercel.app/api/simple");
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
