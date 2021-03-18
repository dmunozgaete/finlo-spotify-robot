"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const puppeteer = require("puppeteer");
exports.default = (username, password) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    yield Promise.all([
        page.goto('https://www.spotify.com/login/'),
        page.waitForSelector("#login-button"),
    ]);
    const userNameInput = yield page.$("#login-username");
    yield userNameInput.type(username);
    const passwordInput = yield page.$("#login-password");
    yield passwordInput.type(password);
    yield Promise.all([
        page.waitForNavigation(),
        page.click("#login-button"),
        page.waitForSelector("a[href=\"/account/profile/\"]"),
    ]);
    yield Promise.all([
        page.goto("https://www.spotify.com/us/account/overview"),
        page.waitForNavigation(),
        page.waitForSelector("article#your-plan"),
    ]);
    yield Promise.all([
        page.click("article#your-plan button"),
        page.waitForSelector("div[role=\"dialog\"] button[type=\"submit\"]"),
    ]);
    yield Promise.all([
        page.click("div[role=\"dialog\"] button[type=\"submit\"]"),
        page.waitForNavigation(),
    ]);
    yield page.pdf({
        path: path.resolve(__dirname, 'enable.pdf')
    });
    yield browser.close();
});
//# sourceMappingURL=enable.js.map