import { compress as brotliCompress } from "https://deno.land/x/brotli@0.1.7/mod.ts";

const BUILD_DIR =
  "/Users/tgross/git/photoshop/photoshop/projects/psweb/build/htdocs/static/js";

async function filterAsync<T>(
  iterable: AsyncIterable<T>,
  callback: (item: T) => boolean
) {
  const collected = [];
  for await (const item of iterable) {
    if (callback(item)) {
      collected.push(item);
    }
  }

  return collected;
}

const jsFiles = await filterAsync(
  Deno.readDir(BUILD_DIR),
  (entry) => entry.isFile && entry.name.endsWith(".js")
);

const loggableData = await Promise.all(
  jsFiles.map(async (entry) => {
    const path = `${BUILD_DIR}/${entry.name}`;
    const stats = await Deno.stat(path);

    const buffer = new Uint8Array(stats.size);
    const file = await Deno.open(path);
    await Deno.read(file.rid, buffer);

    const brotliSize = brotliCompress(buffer, 4096, 11).length;

    return {
      name: entry.name,
      uncompressedSize: stats.size,
      brotliSize,
    };
  })
);

const sortedLogs = loggableData.sort(
  (a, b) => b.uncompressedSize - a.uncompressedSize
);

await Deno.writeFile(
  "./pre-dunamis-esm.json",
  new TextEncoder().encode(JSON.stringify(sortedLogs))
);
