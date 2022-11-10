# Other links:
- [Contributing code](contributing.md)

# Setting up the developer environment

All the following instructions assume you're using Linux. If you're using Windows, I'd recommend using [Windows Subsystem for Linux (WSL)](https://ubuntu.com/wsl) with an Ubuntu install. If you're using macOS, you should be fine.

## Prerequisites
Tools needed for the rest of the project setup:
- [nvm](https://github.com/nvm-sh/nvm)
- [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)

We will install nvm (Node Version Manager) to manage our Node.js versions. This can be installed via

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

Then, we will install the latest version of Node.js 16 via

```bash
nvm install 16
```

We will also install yarn via

```bash
npm install --global yarn
```

This will allow us to use yarn though the command line.

## Setting up the project

### 1. Cloning the repository

Firstly, we will clone this repository via

```bash
git clone https://github.com/CodeyBoi/appendix3.git
```

Or if you have SSH set up (which I would recommend), you can use

```bash
git clone git@github.com:CodeyBoi/appendix3.git
```

This will download the repo into a new folder `appendix3`. Then, we will change directory to the newly cloned repo and install the dependencies via

```bash
cd appendix3
yarn install
```

This will install all dependencies for the project. 

### 2. Environment variables

We will now define some environment variables. Copy the `.env.example` file to `.env` via

```bash
cp .env.example .env
```

Then, open the `.env` file and fill in the values. `NEXTAUTH_SECRET` should be set to any random value. Do this by running

```bash
openssl rand -hex 32
```

Paste the output into the `NEXTAUTH_SECRET` variable.

The other values should be set depending on which authentication provider we're currently using. For example, if we're using Google, we should set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to the values we got from the Google Cloud Platform.

### 3. The database

To set up the database locally (which is what we will be using for development), we will run

```bash
npx prisma generate
```

The schema for this database can be found [here](/prisma/schema.prisma).

To start the development webserver, we will run

```bash
yarn run dev
```

If everything went well, you should be able to see a login screen at [http://localhost:3000](http://localhost:3000)!

# Changing the database schema
The database schema is defined in [`/prisma/schema.prisma`](/prisma/schema.prisma). To modify the schema, simply make a change to this file and run

```bash
npx prisma db push
```

Be careful when modifying the schema, as some changes may require you to lose some data (e.g renaming or removing a column) or even the entire database. Prisma will warn you about this when you do a push, so be sure to read the warning carefully.
