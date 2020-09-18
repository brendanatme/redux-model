/**
 * release
 *
 * usage: `npm run release [major|minor|patch]`
 */
const { execSync } = require('child_process');

const bump = process.argv[2];

console.log(`Preparing for release (this may take a while)...`);

if (!bump) {
  throw new Error('release type missing: make sure you run `npm run release [major|minor|patch]`');
}

execSync(`npm run prepare-release;`, err => console.error(err));

console.log(`Removing tests...`);
execSync(`rm -rf dist/tests`, err => console.error(err));

console.log(`Removing examples...`);
execSync(`rm -rf dist/examples`, err => console.error(err));

console.log(`Removing docs...`);
execSync(`rm -rf dist/docs`, err => console.error(err));

console.log(`Bumping version by: ${bump}...`);
execSync(`npm version ${bump}`, err => console.error(err));

console.log('Copying package.json...');
execSync(`cp package.json dist/package.json`, err => console.error(err));

console.log('Copying README.md...');
execSync(`cp README.md dist/README.md`, err => console.error(err));

console.log('Copying .npmignore...');
execSync(`cp .npmignore dist/.npmignore`, err => console.error(err));

console.log('Publishing to NPM...');
execSync(`npm publish dist --access=public`, err => console.error(err));

console.log('Pushing to Git...');
execSync(`git push`, err => console.error(err));

console.log('Success!');
