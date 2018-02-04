const { port, env } = require('./Configs/vars');
const app = require('./Configs/express');

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
