const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const sample = {
    guests: 2,
    bedrooms: 1,
    beds: 2,
    bath: 1,
    lvPerNight: 40
}

let browser;

const url = "https://www.airbnb.com/s/Prague--Czech-Republic/homes?tab_id=home_tab&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2023-06-01&monthly_length=3&price_filter_input_type=0&price_filter_num_nights=5&channel=EXPLORE&refinement_paths%5B%5D=%2Fhomes&place_id=ChIJi3lwCZyTC0cRkEAWZg-vAAQ&query=Prague%2C%20Czech%20Republic&date_picker_type=flexible_dates&search_type=filter_change&source=structured_search_input_header"

async function scrapeHomesInIndexPage(url) {
    try {
        
        const page = await browser.newPage();
        await page.goto(url);
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = await cheerio.load(html);

        const homes = $("[itemprop='url']")
        .map((i, element) => {
          return "https://" + $(element).attr("content")
        })
        .get()
        return homes;
    } catch (error) {
        console.error(error)
    }
}

async function scrapeDescriptionPage(url, page) {
    try {
        await page.goto(url)
    } catch (error) {
        console.error(error)
    }
}

async function main () {
    browser = await puppeteer.launch({ headless: false });
    const descriptionPage = await browser.newPage()
    const homes = await scrapeHomesInIndexPage(url);

    for (let i = 0; i < homes.length; i++) {
        await scrapeDescriptionPage(homes[i], descriptionPage)
    }
}

main();
// initial search
// https://www.airbnb.com/s/Prague--Czech-Republic/homes?tab_id=home_tab&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2023-06-01&monthly_length=3&price_filter_input_type=0&price_filter_num_nights=5&channel=EXPLORE&refinement_paths%5B%5D=%2Fhomes&place_id=ChIJi3lwCZyTC0cRkEAWZg-vAAQ&query=Prague%2C%20Czech%20Republic&date_picker_type=flexible_dates&search_type=filter_change&source=structured_search_input_header


// after going on page 2 /3 and so on
// https://www.airbnb.com/rooms/32310167?adults=1&children=0&enable_m3_private_room=false&infants=0&pets=0&check_in=2023-05-21&check_out=2023-05-26&federated_search_id=6158b594-1e4c-41c0-8a7a-12e93d754951&source_impression_id=p3_1683126474_3t5gzb3RcvH0z3w0