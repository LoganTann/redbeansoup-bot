module.exports = {
  apps: [
    {
      name: "redbeansoup-bot",
      script: "./mod.ts",
      interpreter: "deno",
      interpreterArgs: "run --allow-net --allow-read --allow-env --allow-write --no-check",
      watch: ["./src"],
      // Delay between restart
      watch_delay: 1000,
    },
  ],
};

