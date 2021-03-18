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

  // Step 2: GO TO OVERVIEW ACCOUNT, AND TRY TO RE-ACTIVATE THE PLAN
  await Promise.all([
    page.goto("https://www.spotify.com/us/account/overview"),
    page.waitForNavigation(),
    page.waitForSelector("article#your-plan"),
  ])

  // RENEW AND WAIT FOR THE CONFIRM DIALOG
  await Promise.all([
    page.click("article#your-plan button"),
    page.waitForSelector("div[role=\"dialog\"] button[type=\"submit\"]"),
  ])


  // PRESS RENEW TO CONFIRM (FIND THE SUBMIT BUTTON)
  await Promise.all([
    page.click("div[role=\"dialog\"] button[type=\"submit\"]"),
    page.waitForNavigation(),
  ])


  await page.pdf({
    path: path.resolve(__dirname, 'enable.pdf')
  });

  await browser.close();
}