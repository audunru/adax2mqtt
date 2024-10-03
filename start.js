import { exec } from "child_process";
import open from "open";
import esbuild from "esbuild";

const plugins = [
  {
    name: "rebuild-notify",
    setup(build) {
      build.onEnd(() => {
        console.log("Rebuilding...");

        // Step 2: Open the browser after the first build
        open("http://localhost:3000/api/v1/content");

        // Step 3: Start nodemon to watch and restart the app
        exec(
          "npx nodemon --watch dist-dev dist-dev/express.cjs",
          (err, stdout, stderr) => {
            if (err) {
              console.error(`Error starting nodemon: ${err.message}`);
              return;
            }
            console.log(stdout);
            console.error(stderr);
          },
        );
      });
    },
  },
];

const watch = async () => {
  const ctx = await esbuild.context({
    entryPoints: ["./src/express/index.ts"],
    bundle: true,
    platform: "node",
    outfile: "./dist-dev/express.cjs",
    format: "cjs",
    plugins,
  });
  await ctx.watch();
};

watch();
