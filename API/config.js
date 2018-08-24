/**
 *  Create and export configuration variable
 * 
 */

 // Container for all the environment
let environments = {};

// Staging (default) environment

environments.staging = {
    'httpPort'      : 3000,
    'httpsPort'     : 3001,
    'envName'   : 'staging'
};

// Production environment
environments.production = {
    'httpPort'      : 5000,
    'httpsPort'     : 5001,
    'envName'       : 'production'
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

// Check that currennt environment is one of the envinments above, if not, default to staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export Module
module.exports = environmentToExport;