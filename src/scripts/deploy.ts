import { execSync } from 'child_process';

if (process.argv.length > 2) {
  console.log('This script does not accept any arguments.');
  process.exit();
}

const hasUncommittedChanges =
  execSync('git status --porcelain').toString().trim().length > 0;
if (hasUncommittedChanges) {
  console.log(
    'You have uncommitted changes. Please commit or stash them before deploying.'
  );
  process.exit();
}

const currentCheckout = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

const command = `git checkout prod && git fetch origin main && git reset --hard FETCH_HEAD && git clean -df && git push -f && git checkout ${currentCheckout}`;
console.log(command);
const output = execSync(command);
process.stdout.write(output.toString());
