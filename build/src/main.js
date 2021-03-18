"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs = require("yargs");
const options = require("cli-select");
const child_process_1 = require("child_process");
const prompts = require("prompts");
const robots = require("./robots");
const availableRobots = {
    spotify: {
        enable: {
            command: 'spotify_enable',
            description: 'enable subscription'
        },
        disable: {
            command: 'spotify_disable',
            description: 'disable subscription'
        }
    },
    netflix: {
        enable: {
            command: 'netflix enable',
            description: 'enable subscription'
        },
        disable: {
            command: 'netflix enable',
            description: 'disable subscription'
        }
    }
};
let argv = yargs
    .command('wizard', 'show finlo wizards to choose between robots', () => {
    const robots = Object.keys(availableRobots);
    options({ values: robots }, (selected) => {
        const availablesOptions = availableRobots[selected.value];
        options({
            values: availablesOptions,
            valueRenderer: (value) => {
                return value.description;
            },
        }, (selected) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const response = yield prompts([
                {
                    type: 'text',
                    name: 'username',
                    message: 'What is your spotify username?'
                },
                {
                    type: 'text',
                    name: 'password',
                    message: 'What is your spotify password?'
                }
            ]);
            const command = `node ${process.cwd()}/. ${selected.value.command} -u ${response.username} -p ${response.password}`;
            console.log(command);
            child_process_1.spawnSync(command, {
                stdio: 'inherit',
                shell: true
            });
        }));
    });
})
    .command(availableRobots.spotify.disable.command, availableRobots.spotify.disable.description, (yargs) => {
    return yargs
        .option('username', {
        alias: 'u',
        type: "string",
        describe: "username for spotify account",
        demandOption: true,
    })
        .option('password', {
        alias: 'p',
        type: "string",
        describe: "password for spotify account",
        demandOption: true,
    });
}, (argv) => {
    robots.spotify_disable(argv.username, argv.password);
})
    .command(availableRobots.spotify.enable.command, availableRobots.spotify.enable.description, (yargs) => {
    return yargs
        .option('username', {
        alias: 'u',
        type: "string",
        describe: "username for spotify account",
        demandOption: true
    })
        .option('password', {
        alias: 'p',
        type: "string",
        describe: "password for spotify account",
        demandOption: true,
    });
}, (argv) => {
    robots.spotify_enable(argv.username, argv.password);
})
    .demandCommand()
    .wrap(72)
    .showHelpOnFail(true)
    .help()
    .argv;
if (argv.v) {
    console.info("Verbose mode on.");
}
//# sourceMappingURL=main.js.map