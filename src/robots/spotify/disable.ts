import * as path from 'path'
import * as puppeteer from "puppeteer";

export default async (username: string, password: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await Promise.all([
        page.goto('https://www.spotify.com/login/'),
        page.waitForSelector("#login-button"),
    ]);

    const userNameInput = await page.$("#login-username");
    await userNameInput.type(username);

    const passwordInput = await page.$("#login-password");
    await passwordInput.type(password);

    await Promise.all([
        page.waitForNavigation(),
        page.click("#login-button"),
        page.waitForSelector("a[href=\"/account/profile/\"]"),
    ])

    // Step 2: GO TO SUBSCRIPTION CHANGE, AND TRY TO CHANGE A PLAN
    await Promise.all([
        page.goto("https://www.spotify.com/us/account/subscription/change/"),
        page.waitForNavigation(),
        page.waitForSelector("a[href*=\"account/subscription/change/intent\"]"),
    ])

    // Step 3: TRY TO SET TO FREE PLAN (CANCEL SUBSCRIPTION)
    const CANCEL_PLAN_BUTTON_EXPRESION = "a[href*=\"account/subscription/change/intent/?target=free\"]"
    await Promise.all([
        page.goto("https://www.spotify.com/us/account/subscription/change/"),
        page.waitForNavigation(),
        page.waitForSelector(CANCEL_PLAN_BUTTON_EXPRESION),
    ])

    const CANCEL_BUTTON_CONFIRM_EXPRESSION = "button[data-qa=\"Cancel Button\"]";
    await Promise.all([
        page.waitForNavigation(),
        page.click(CANCEL_PLAN_BUTTON_EXPRESION),
        page.waitForSelector(CANCEL_BUTTON_CONFIRM_EXPRESSION)
    ]);


    // STEP 4: FORM THE  WHY CANCEL PLAN PAGE
    const WHY_CANCEL_BUTTON_EXPRESSION = "button[type=submit]"
    await Promise.all([
        page.click(CANCEL_BUTTON_CONFIRM_EXPRESSION),
        page.waitForNavigation(),
        page.waitForSelector(WHY_CANCEL_BUTTON_EXPRESSION)
    ]);

    // MARK OPTIONS FOR THE WHY CANCEL FORM
    await page.click("label[for=\"what-is-the-main-reason-you-canceled-your-spotify-premium-i-am-switching-to-a-different-spotify-premium-plan\"]");
    await page.click("label[for=\"how-likely-are-you-to-subscribe-to-spotify-premium-again-in-the-near-future-extremely-likely\"]");
    await page.click(WHY_CANCEL_BUTTON_EXPRESSION);

    await page.pdf({
        path: path.resolve(__dirname, 'disable.pdf')
    });

    await browser.close();
}