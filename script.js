require('chromedriver');

let wd = require('selenium-webdriver');
let matchid = 35502;
let browser = new wd.Builder().forBrowser('chrome').build(); // control the browser

let batsmankeys = ['playerName', 'outType', 'runs', 'balls', 'fours', 'sixes', 'strikeRate'];
let bowlerkeys = ['playerName', 'overs', 'maidens', 'runs', 'wickets', 'noball', 'wide', 'economy'];

let batsmanData = [];
let bowlerData = [];

let innings = 1;

async function main() {
	await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchid}`); //URL

	await browser.wait(wd.until.elementLocated(wd.By.css('.cb-nav-bar a')));

	//////////////////////////////// Click the scorecard button///////////////////////
	let navbarbuttons = await browser.findElements(wd.By.css('.cb-nav-bar a'));
	await navbarbuttons[1].click();
	//////////////////////////////////////////////////////////////////////////////////

	await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`))); //wait jab tak page load nhi hota
	let alltables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));

	let batsmanRow = await alltables[0].findElements(wd.By.css('.cb-col.cb-col-100.cb-scrd-itms'));

	let length = batsmanRow.length;
	for (let i = 0; i < length - 3; i++) {
		let batsmanCol = await batsmanRow[i].findElements(wd.By.css('div'));
		let data = {};
		for (j in batsmanCol) {
			if (j != 1) {
				data[batsmankeys[j]] = await batsmanCol[j].getAttribute('innerText');
			}
		}
		batsmanData.push(data);
	}

	let bowlerrows = await alltables[1].findElements(wd.By.css('.cb-col.cb-col-100.cb-scrd-itms'));

	for (i in bowlerrows) {
		let bowlercols = await bowlerrows[i].findElements(wd.By.css('div'));
		let data = {};
		for (j in bowlercols) {
			data[bowlerkeys[j]] = await bowlercols[j].getAttribute('innerText');
		}
		bowlerData.push(data);
	}

	console.log(batsmanData);
	console.log(bowlerData);
}

main();
