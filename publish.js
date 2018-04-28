const packageJson = require('./package.json');
const util = require('util');
const spawn = require('child_process').spawn;
const writeFile = util.promisify(require('fs').writeFile);

const packageJsonPathConstant = './package.json';
const additionalPackageNames = [
    'adaptivehtml'
];

async function writePackageJson(packageJsonPath, packageJson) {
    return await writeFile(packageJsonPath, packageJson, {
        encoding: 'utf8'
    });
}

async function publish(logger) {
    return new Promise((resolve, reject) => {
        var publish = spawn('npm', ['publish']);
        publish.stdout.on('data', function (data) {
            logger(data.toString());
        });
        publish.on('error', function (error) {
            reject(error);
        });
        publish.on('exit', function (code) {
            resolve();
        });
    });
}

(async function () {
    var packageJsonName = packageJson.name || '';
    if (packageJsonName) {
        additionalPackageNames.push(packageJsonName);
    }
    for (var packageName of additionalPackageNames) {
        try {
            console.log(`Publishing ${packageName}`);
            let packageJsonCopy = Object.assign({}, packageJson);
            packageJsonCopy.name = packageName;
            await writePackageJson(packageJsonPathConstant, JSON.stringify(packageJsonCopy, null, '\t'));
            await publish(console.log);
            console.log(`Publishing ${packageName} complete`);
        } catch (error) {
            console.error(`Error publishing: ${error}`);
            break;
        }
    }
    console.log('Publishing complete');
}());