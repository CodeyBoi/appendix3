import { execSync } from "child_process";

if (process.argv.length > 3) {
  console.log("Too many arguments. Please use --help for usage information.");
  process.exit();
}

if (process.argv[2] === "--help" || process.argv[2] === "-h") {
  console.log("Usage: yarn stage [source]");
  console.log("Pushes the current branch or the specified source branch to the staging branch.");
  process.exit();
}

const hasUncommittedChanges = execSync("git status --porcelain").toString().trim().length > 0;
if (hasUncommittedChanges) {
  console.log("You have uncommitted changes. Please commit or stash them before staging.");
  process.exit();
}

const currentCheckout = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

const source = process.argv[2] ? process.argv[2] : currentCheckout;
if (source === "staging") {
  console.log("You cannot stage with the staging branch as the source.");
  process.exit();
}

const command = `
  git checkout staging
    && git fetch origin ${source}
    && git reset --hard FETCH_HEAD
    && git clean -df
    && git push -f
    && git checkout ${currentCheckout}
`;
console.log(command);
const output = execSync(command);
console.log(output.toString());
