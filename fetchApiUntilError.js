const nbFetch = 20

const main = async () => {
  while (true) {
    fetch(
      `https://test-edge-planetscale.vercel.app/api/fetch-azzapp-api?nbFetch=${nbFetch}`
    ).then(async (response) => {
      if (response.status !== 200) {
        console.log(
          `Error fetching data status : ${response.status} ${await response.text().catch(() => '')}`
        );
        process.exit(1);
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};

main();