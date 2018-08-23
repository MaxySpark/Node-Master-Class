/**
 *  Create and export configuration variable
 * 
 */

 // Container for all the environment
let environments = {};

// Staging (default) environment

environments.staging = {
    'port'      : 3000,
    'envName'   : 'staging'
};

// Production environment
environments.production = {
    'port'      : 5000,
    'envName'   : 'production'
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

// Check that currennt environment is one of the envinments above, if not, default to staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export Module
module.exports = environmentToExport;