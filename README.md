# Other links:
- [Contributing code](contributing.md)

# Setting up the developer environment

## Prerequisites
### a. Prerequisites for Windows

To setup the project on Windows, you will need the following:

- [Git](https://git-scm.com/download/win) (download `Git for Windows Setup` from the latest release and run it)
- [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases) (download `nvm-setup.exe` from the latest release and run it)
- [Windows PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.3)

### b. Prerequisites for Linux/MacOS

To setup the project on Linux/MacOS, you will need the following:

- Git (`sudo apt install git`)
- [nvm](https://github.com/nvm-sh/nvm)

You can install `nvm` via

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

## 2. Setting up the project

Open a new command prompt window and run the following commands to install Node.js 16 and Bun:

```bash
nvm install 16
nvm use 16
npm install --global bun
```

Now we will download the project. Move to the directory where you want to download the project to (using `cd`) and run:

```bash
git clone git@github.com:CodeyBoi/appendix3.git
```

_Note:_ This requires you to have SSH set up (instructions for doing that can be found [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)). I would highly recommend doing this, as it makes it much easier to push code to the repository. If you don't want to set up SSH, you can use the following command instead:

```bash
git clone https://github.com/CodeyBoi/appendix3.git
```

This will download the repo into a new folder `appendix3`. Then, we will change directory to the newly cloned repo and install the dependencies via

```bash
cd appendix3
bun install
bun next telemetry disable
```

This will install all needed dependencies for the project.

*NOTE: If you're using Windows, you might get an error saying something like `bun.ps1 cannot be loaded because running scripts is disabled on this system`. If this happens, you need to open a new PowerShell window as an administrator (right click on the PowerShell icon and click `Run as administrator`) and run the following command:*

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

*Then, close the PowerShell window and open a new one. You should now be able to run `bun install` without any issues (hopefully).*

## 3. Environment variables

We will now define some environment variables. Copy the `.env.example` file to `.env` via

```bash
cp .env-example .env
```


Then, open the `.env` file and fill in the values. `NEXTAUTH_SECRET` should be set to any random value. Do this by running

```bash
openssl rand -hex 32
```

Paste the output into the `NEXTAUTH_SECRET` variable.

Ask your local ITK for what values to put in the other fields.

## 4. The database

To set up the database locally (which is what we will be using for development), we will run

```bash
bunx prisma generate
```

The schema for this database can be found [here](/prisma/schema.prisma).

To start the development webserver, we will run

```bash
bun dev
```

If everything went well, you should be able to see a login screen at [http://localhost:3000](http://localhost:3000)!

# Changing the database schema
The database schema is defined in [`/prisma/schema.prisma`](/prisma/schema.prisma). To modify the schema, simply make a change to this file and run

```bash
bunx prisma db push
```

Be careful when modifying the schema, as some changes may require you to lose some data (e.g renaming or removing a column) or even the entire database. Prisma will warn you about this when you do a push, so be sure to read the warning carefully.
