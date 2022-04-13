FROM denoland/deno:alpine

WORKDIR /app
RUN chown deno .
copy --chown=deno:deno src/ src/
copy --chown=deno:deno ./*.ts .

USER deno
RUN deno cache deps.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--no-check", "./mod.ts"]