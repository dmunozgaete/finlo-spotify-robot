import * as yargs from "yargs";
import * as options from "cli-select";
import { spawnSync } from "child_process";
import * as prompts from "prompts";
import * as robots from "./robots";

//let verbose: boolean = false;
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

    // Show the options for selected robots
    options({ values: robots }, (selected: any) => {
      const availablesOptions: { [key: string]: { description: string } } = availableRobots[selected.value];
      // Show the available robots for selected robots
      options({
        values: availablesOptions,
        valueRenderer: (value) => {
          return value.description;
        },
      }, async (selected: any) => {
        // Now Ask for parameters (username and password)
        const response = await prompts([
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
        console.log(command)
        spawnSync(command, {
          stdio: 'inherit',
          shell: true
        });
      })
    })
  })
  /**********************************************************
   *  SPOTIFY: 
   *      Disable Subscription for the account
  /**********************************************************/
  .command(availableRobots.spotify.disable.command, availableRobots.spotify.disable.description, (yargs: yargs.Argv) => {
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
      })
  }, (argv) => {
    console.log(argv)
    robots.spotify_disable(argv.username, argv.password)
  })

  /**********************************************************
   *  SPOTIFY: 
   *      Enable Subscription for the account
  /**********************************************************/
  .command(availableRobots.spotify.enable.command, availableRobots.spotify.enable.description, (yargs: yargs.Argv) => {
    return yargs
      .option('username', {
        alias: 'u',
        default: 'dmunozgaete@gmail.com',
        type: "string",
        describe: "username for spotify account",
        demandOption: true
      })
      .option('password', {
        alias: 'p',
        default: '123.Momia3s',
        type: "string",
        describe: "password for spotify account",
        demandOption: true,
      })
  }, (argv) => {
    console.log('ENABLE!')
    console.log(argv)
    robots.spotify_enable(argv.username, argv.password)
  })
  .demandCommand()
  .wrap(72)
  .showHelpOnFail(true)
  .help()
  .argv;

if (argv.v) {
  //verbose = true;
  console.info("Verbose mode on.");
}