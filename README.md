# Redbeansoup-bot

> ## Important note 
> The bot actually runs the code in the [prod](https://github.com/LoganTann/redbeansoup-bot/tree/prod) branch, but a rewrite is planned at https://github.com/LoganTann/redbeansoup-v2  
> No features will be added in this repo, only bug fixes

Actually, port of the Descalendrier website into a discord bot.

It uses the API created by [@JiveOff](https://github.com/jiveoff) to collect calendar data, and Discordeno lib as the bot framework.

## Run Bot

Make sure Deno is installed

```powershell
$ deno run -A --no-check mod.ts
```

If you don't want to copy paste the command above, you can also download pm2 and start the ecosystem file :

```powershell
$ pm2 start
```
