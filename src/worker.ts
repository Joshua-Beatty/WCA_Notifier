import * as cheerio from 'cheerio';

export interface Env {
	PROJECTS: KVNamespace;
	DISCORD_URI: string
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		await Notify(env)
	},
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const html = await Notify(env);
		return new Response(html);
	},

};

async function Notify(env: Env): Promise<string> {

	const response = await fetch('https://www.worldcubeassociation.org/competitions?region=all&search=&year=all+years&state=by_announcement&from_date=&to_date=&delegate=&display=list')
	const wcaSite = await response.text()
	const $ = cheerio.load(wcaSite);

	const comps = $('.competition-info')
	const compInfo: { link: string, name: string, location: string }[] = [];
	comps.each(function (i, elm) {
		const link = $(this).find('.competition-link a')
		const location = $(this).find('.location')
		compInfo.push({ link: link.attr("href")?.trim() || "", name: link.text().trim(), location: location.text().trim() }) // for testing do text() 
	});

	const filteredComps = compInfo.filter(x => {
		if (x.location.toLowerCase().includes("utah"))
			return true
		return false
	})


	const currentComps = (await env.PROJECTS.get("found-comps"))?.split(",") || []

	const nonNotifiedComps = filteredComps.filter(x => {
		return !currentComps.includes(x.link)
	})

	for (const comp of nonNotifiedComps) {
		const url = 'https://discord.com/api/webhooks/984955884734128128/ZbKmJZBIOdiAKnfs7Pv_TYH1RTpsyc9OsEF220gwePRxtWhHxcWDSVrCJKJqDVdbrGZa'
		const data = { "content": `<@207174394504675328> New WCA Comp in utah. ${comp.name} in ${comp.location}, https://www.worldcubeassociation.org${comp.link}` };
		const customHeaders = {
			"Content-Type": "application/json",
		}

		fetch(url, {
			method: "POST",
			headers: customHeaders,
			body: JSON.stringify(data),
		})
	}

	await env.PROJECTS.put("found-comps", filteredComps.map(x => x.link).join(","));

	return JSON.stringify(nonNotifiedComps);
}