# Redbeansoup-bot

> ## Important note 
> The bot actually runs the code in the [prod](https://github.com/LoganTann/redbeansoup-bot/tree/prod) branch, but a rewrite is planned at https://github.com/LoganTann/redbeansoup-v2  
> No features will be added in this repo, only bug fixes

Actually, port of the Descalendrier website into a discord bot.

It uses the API created by [@JiveOff](https://github.com/jiveoff) to collect calendar data, and Discordeno lib as the bot framework.


## Run Bot from command line

Create a .env file :
```env
# Your app id
clientId=
# Your app's bot token
BOT_TOKEN=
# A guild you are using for __development__
DEV_GUILD_ID=
```

Then, make sure Deno is installed

```powershell
$ deno run -A --no-check mod.ts
```

If you don't want to copy paste the command above, you can also download pm2 and start the ecosystem file :

```powershell
$ pm2 start
```

## Run bot using docker

Clone the repo, enter the dir, build the image :
```powershell
$ docker build -t redbeansoup-image .
```

Run the image :
```powershell
# it if it's *not* the first time, make sure to do `docker rm redbeansoup-image` before 
$ docker run -it --env-file .env --name redbeansoup redbeansoup-image
```

