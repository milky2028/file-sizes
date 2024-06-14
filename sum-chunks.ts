const decoder = new TextDecoder();

type Sizes = {
  name: string;
  uncompressedSize: number;
  brotliSize: number;
};

function sum(arr: Sizes[], property: "uncompressedSize" | "brotliSize") {
  return arr.reduce((curr, acc) => curr + acc[property], 0);
}

const original: Sizes[] = JSON.parse(
  decoder.decode(await Deno.readFile("./pre-dunamis-esm.json"))
);

const originalUncompressed = sum(original, "uncompressedSize");
const originalBrotli = sum(original, "brotliSize");

const esm: Sizes[] = JSON.parse(
  decoder.decode(await Deno.readFile("./post-dunamis-esm.json"))
);

const esmUncompressed = sum(esm, "uncompressedSize");
const esmBrotli = sum(esm, "brotliSize");

console.log(`Uncompressed Diff: ${originalUncompressed - esmUncompressed}`);
console.log(`Compressed Diff: ${originalBrotli - esmBrotli}`);
