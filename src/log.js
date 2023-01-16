import chalk from "chalk"

function info(msg) {
    console.log(chalk.white(msg));
}

function success(msg) {
    console.log(chalk.green(msg));
}

function error(msg) {
    console.error(chalk.redBright.bold(msg));
}

export default {
    info,
    success,
    error,
}