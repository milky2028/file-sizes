const BUILD_DIR =
  "/Users/tgross/Documents/photoshop/photoshop/projects/psweb/build/static/js";

function toKilobytes(bytes: number) {
  return bytes / 1024;
}

const format = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
}).format;

const files = Deno.readDir(BUILD_DIR);
for await (const entry of files) {
  if (entry.isFile && entry.name.endsWith("js")) {
    const path = `${BUILD_DIR}/${entry.name}`;
    const stats = await Deno.stat(path);

    console.log(`%c${entry.name}:`, "font-weight: bold; color: white;");
    console.log(`%c${format(toKilobytes(stats.size))}kb`, "color: green;");
  }
}
