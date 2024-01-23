require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');


async function getShortLinks() {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: "new",
          });
          
        const page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('https://www.amazon.com.br/ap/signin?openid.pape.max_auth_age=900&openid.return_to=https%3A%2F%2Fwww.amazon.com.br%2Fgp%2Fyourstore%2Fhome%3Fpath%3D%252Fgp%252Fyourstore%252Fhome%26useRedirectOnSuccess%3D1%26signIn%3D1%26action%3Dsign-out%26ref_%3Dnav_AccountFlyout_signout&openid.assoc_handle=brflex&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0');

        await page.type('#ap_email', process.env.EMAIL);
        await page.click('#continue');

        await page.waitForSelector('#ap_password');
        await page.type('#ap_password', process.env.PASSWORD);
        await page.click('#signInSubmit');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await page.goto('https://www.amazon.com.br/gp/goldbox?ref_=nav_cs_gb', { waitUntil: 'domcontentloaded', timeout: 5000 });

        await page.waitForTimeout(5000);

        let productLinks = await page.$$eval('a.a-link-normal', links => links.map(link => link.href));

        function getRandom(arr, quantidade) {
            let result = new Array(quantidade);
            let len = arr.length;

            let taken = new Array(len);

            if (quantidade > len)
                throw new RangeError("getRandom: more elements taken than available");
            while (quantidade--) {
                let x = Math.floor(Math.random() * len);
                result[quantidade] = arr[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
            }
            return result;
        }

        let randomLinks = getRandom(productLinks, 5);
        let allShortLinks = [];

        for (let i = 0; i < randomLinks.length; i++) {
            await page.goto(randomLinks[i], { waitUntil: 'domcontentloaded', timeout: 5000 });
            await page.waitForSelector('#amzn-ss-text-link');
            await page.click('#amzn-ss-text-link');

            await page.waitForSelector('#amzn-ss-full-link-radio-button > label > input[type=radio]', { visible: true });
            await page.click('#amzn-ss-full-link-radio-button > label > input[type=radio]');

            await page.waitForTimeout(10000);
            await page.waitForSelector('#amzn-ss-text-fulllink-textarea');
            let shortLink = await page.$eval('#amzn-ss-text-fulllink-textarea', textarea => textarea.value);
            allShortLinks.push(shortLink);
        }

        await browser.close();
        return allShortLinks;
    } catch (error) {
        console.error(error);
    }
}



(async () => {
    const allShortLinks = await getShortLinks();

    async function sendMessage(senMessage) {
        try {
            const response = await axios.post('https://api.telegram.org/bot' + process.env.TOKEN + '/sendMessage', {
                chat_id: process.env.CHAT_ID,
                text: senMessage
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    for (let i = 0; i < allShortLinks.length; i++) {
        await sendMessage(allShortLinks[i]);
    }

})();


