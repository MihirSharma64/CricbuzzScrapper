require('chromedriver');
let fs = require('fs');

let wd = require('selenium-webdriver');
let matchid = 35043;
let browser = new wd.Builder().forBrowser('chrome').build(); // control the browser

let batsmankeys = ['Matches', 'Innings', 'NotOut', 'Runs', 'highestScore', 'avgScore', 'ballsPlayed', 'strikeRate', 'hundreds', 'twoHundreds', 'fifeties', 'fours', 'sixes'];
let bowlerkeys = ['Matches', 'Innings', 'balls', 'runs', 'wickets', 'bestBowlingInnings', 'bestBowlingMatch', 'economy', 'bowlingAVG', 'bowlingSR', '5wickets', '10wickets'];

let batsmanURL = [];
let bowlerURL = [];

let innings = 1;
let urls = [];
let careerData = [];
let playersAdded = 0;

async function getCareerData(url, i, totalPlayers) {
	let browser = new wd.Builder().forBrowser('chrome').build();
	await browser.get(url);
	let tables = await browser.findElements(wd.By.css('table.cb-col-100.cb-plyr-thead'));
	for (j in tables) {
		let data = {};
		let rows = await tables[j].findElements(wd.By.css('tbody tr'));
		for (row of rows) {
			let tempdata = {};
			let cols = await row.findElements(wd.By.css('td'));
			let keyArr = batsmankeys;
			if (j == 1) {
				keyArr = bowlerkeys;
			}

			let matchType = await cols[0].getAttribute('innerText');
			for (let k = 1; k < cols.length; k++) {
				tempdata[keyArr[k - 1]] = await cols[k].getAttribute('innerText');
			}
			data[matchType] = tempdata;
		}
		if (j == 0) {
			careerData[i]['battingCareer'] = data;
		} else {
			careerData[i]['bowlingCareer'] = data;
		}
	}

	browser.close();

	playersAdded += 1;
	if (totalPlayers == playersAdded) {
		fs.writeFileSync('careerData.json', JSON.stringify(careerData));
	}
}

async function main() {
	await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchid}`); //URL

	await browser.wait(wd.until.elementLocated(wd.By.css('.cb-nav-bar a')));

	let navbarbuttons = await browser.findElements(wd.By.css('.cb-nav-bar a'));
	await navbarbuttons[1].click();

	await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
	let alltables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));

	let batsmanRow = await alltables[0].findElements(wd.By.css('.cb-col.cb-col-100.cb-scrd-itms'));
	for (let i = 0; i < batsmanRow.length; i++) {
		let batsmanCol = await batsmanRow[i].findElements(wd.By.css('div'));
		if (batsmanCol.length == 7) {
			let url = await batsmanCol[0].findElement(wd.By.css('a')).getAttribute('href');
			urls.push(url);
			let playerName = await batsmanCol[0].getAttribute('innerText');
			careerData.push({playerName: playerName});
		}
	}

	let bowlerrows = await alltables[1].findElements(wd.By.css('.cb-col.cb-col-100.cb-scrd-itms'));

	for (i in bowlerrows) {
		let bowlercols = await bowlerrows[i].findElements(wd.By.css('div'));
		if (bowlercols.length == 8) {
			let url = await bowlercols[0].findElement(wd.By.css('a')).getAttribute('href');
			let playerName = await bowlercols[0].getAttribute('innerText');
			urls.push(url);
			careerData.push({playerName: playerName});
		}
	}

	for (i in urls) {
		getCareerData(urls[i], i, urls.length);
	}

	browser.close();
}

main();
