
# WCA_Notifier

This repo contains the code for a cloudflare worker that checks the WCA Competitions Page once a day and notify a discord server when new competitions are added that take place in utah. It uses cloudflare KV for data storage, to mark what compeittions have already been sent to discord.


## Development and Deployment

#### Development
You will need to install all dependencies with 

```bash
  npm i
```

You will also need to modify wrangler.toml to point towards your own kv_namespaces

Then you can start local testing by running

```bash
npm start
```

#### Deployment
To deploy this to your cloudflare instance, after you have set up Wrangler and connected it to your Cloudflare account, run the following command

```bash
  npm run deploy
```


## Environment Variables

To run this project, you will need to add the environment variable `DISCORD_URI` to your .dev.vars file, and to your production secrets.

To add to your production secrets run the following command

```bash
wrangler secret put DISCORD_URI
```

And your .dev.vars file should look like:

```bash
DISCORD_URI=https://discord.com/api/webhooks/123456789/abcdefg
```

