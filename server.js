const chalk = require('chalk');

global.__ = console.log;
global._ = (parameter) => {
  console.log(chalk.green.bgYellow(parameter));
};
global._e = (parameter) => {
  console.log(chalk.red.bgRed(parameter));
};

//# -- CODE START -- #

//` Setting up the environment variables
const dotenv = require('dotenv');
dotenv.config({
  path: './.env',
});
//` Database Configuration
require('./database');
const app = require('./app.js');

const { PORT } = process.env;

app.listen(PORT, () => {
  _(`Server is running on port ${PORT}`);
});
