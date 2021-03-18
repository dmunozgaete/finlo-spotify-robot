"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const puppeteer = require("puppeteer");
exports.default = (username, password) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log(username, password);
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
    yield page.pdf({
        path: path.resolve(__dirname, 'enable-0.pdf')
    });
    yield Promise.all([
        page.goto("https://www.spotify.com/us/account/overview"),
        page.waitForNavigation(),
        page.waitForSelector("article#your-plan"),
    ]);
    yield page.pdf({
        path: path.resolve(__dirname, 'enable.pdf')
    });
    yield browser.close();
});
//# sourceMappingURL=enable.js.map