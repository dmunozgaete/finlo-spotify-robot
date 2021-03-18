"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const puppeteer = require("puppeteer");
const LOGIN_USERNAME = "wewchile";
const LOGIN_PASSWORD = "Finlo1234$";
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    yield Promise.all([
        page.goto('https://www.spotify.com/login/'),
        page.waitForSelector("#login-button"),
    ]);
    const userNameInput = yield page.$("#login-username");
    yield userNameInput.type(LOGIN_USERNAME);
    const passwordInput = yield page.$("#login-password");
    yield passwordInput.type(LOGIN_PASSWORD);
    yield Promise.all([
        page.waitForNavigation(),
        page.click("#login-button"),
        page.waitForSelector("a[href=\"/account/profile/\"]"),
    ]);
    yield Promise.all([
        page.goto("https://www.spotify.com/us/account/subscription/change/"),
        page.waitForNavigation(),
        page.waitForSelector("a[href*=\"account/subscription/change/intent\"]"),
    ]);
    const CANCEL_PLAN_BUTTON_EXPRESION = "a[href*=\"account/subscription/change/intent/?target=free\"]";
    yield Promise.all([
        page.goto("https://www.spotify.com/us/account/subscription/change/"),
        page.waitForNavigation(),
        page.waitForSelector(CANCEL_PLAN_BUTTON_EXPRESION),
    ]);
    const CANCEL_BUTTON_CONFIRM_EXPRESSION = "button[data-qa=\"Cancel Button\"]";
    yield Promise.all([
        page.waitForNavigation(),
        page.click(CANCEL_PLAN_BUTTON_EXPRESION),
        page.waitForSelector(CANCEL_BUTTON_CONFIRM_EXPRESSION)
    ]);
    const WHY_CANCEL_BUTTON_EXPRESSION = "button[type=submit]";
    yield Promise.all([
        page.click(CANCEL_BUTTON_CONFIRM_EXPRESSION),
        page.waitForNavigation(),
        page.waitForSelector(WHY_CANCEL_BUTTON_EXPRESSION)
    ]);
    yield page.click("label[for=\"what-is-the-main-reason-you-canceled-your-spotify-premium-i-am-switching-to-a-different-spotify-premium-plan\"]");
    yield page.click("label[for=\"how-likely-are-you-to-subscribe-to-spotify-premium-again-in-the-near-future-extremely-likely\"]");
    yield page.click(WHY_CANCEL_BUTTON_EXPRESSION);
    yield page.pdf({
        path: path.resolve(__dirname, 'file.pdf')
    });
    yield browser.close();
}))();
//# sourceMappingURL=spotify-deactivate.js.map