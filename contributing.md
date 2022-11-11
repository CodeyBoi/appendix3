# Making a change on the repository

This will go though making a change on the repository, step by step.

Wordlist:
* **repo** - Short for repository, which is where the entire project (appendix2.0) lies. This includes files, version history, branches and so on.
* **local repo** - The repository which is stored on your machine. It is updated by using `git pull`.
* **remote repo** - The repository which is on Githubs servers, and which is publicly available. Changes made to your *local repo* will **not** be available to the *remote repo* until you push them (using `git push`).

## 1. Create a new branch which you will work on

First you need to fully update your local copy of the website. This is done by moving to your local repo (the folder to which `git clone` wrote to) and running the following commands:

    $ git checkout main
    $ git pull

This will switch you to the main branch, and download and apply any available updates to your local repo.

You now can create a new branch. This is done with

    $ git checkout -b <name-of-your-new-branch>

## 2. Commit your changes

Make your changes to your local repo (more info about how to write code for the website will be in the section *Writing code for Blindtarmen 3*).

Before you can upload your changes to the remote repo you need to *commit* them. Firstly, add the files you want to change to your commit using `git add path/to/file`, or `git add -A` to add all files in your repo which you have changed. Then run

    $ git commit -m "A message which very briefly describes your changes"

If we, for example, updated this text (in `/contributing.md`) by adding a chapter *How to befriend a duck*, we would run the following. 

    $ git add contributing.md
    $ git commit -m "Added chapter 'How to befriend a duck'"

*Note: It's often helpful to check your status with `git status`. This will, for example, show you which files you have changed, which files are staged for commit, and so on.*

## 3. Upload your changes

The main branch may have been updated since you created your branch. In this case you need to merge your changes with the changes made to the main branch. This is done by the following:

    $ git checkout <name-of-your-branch>
    $ git merge origin/main
    $ git push

If the changes to the main branch and to your branch could be automatically resolved, congratulations! If not, you need to resolve it manually. This can be difficult and is outside the scope of this text, but you can read more about it [here!](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-on-github)

## 4. Applying your changes to the main branch

So you're happy with your code, and everything looks great. Wonderful! All that's left to do is to create a *pull request*, which will pull your changes into the main branch.

Firstly, open a web browser of your choice and go to [the repo on github](https://github.com/CodeyBoi/appendix2.0). Then switch to your branch using the branch selector (it can be found in the top left under the header, it should say *main*). 

Press the button **Contribute** and then **Open pull request**. Input a reasonable title and a comment which describes the changes you have done. Then press **Create pull request**.

Someone will then check your code, comment on anything that needs to be changed, and then merge your branch with the main branch.

Good job!

# Writing code for Blindtarmen 3

This project is build using the [T3 stack](https://github.com/t3-oss/create-t3-app). This means we'll mainly be interacting with the following packages:
- [Next.js](https://nextjs.org/) - For building the website
- [Prisma](https://www.prisma.io/) - For querying and defining our database
- [tRPC](https://trpc.io/) - For creating a type-safe API for our database
- [Mantine](https://mantine.dev/) - Contains a lot of pre-made components for our website (buttons, forms, etc.)

The entire project (except for a couple files) is written in TypeScript, which is a typed extension of JavaScript. This means that we can define the types of variables, functions, and so on. This is very useful, as it allows us to catch errors at compile time, instead of at runtime. It also often makes it easier to read and understand the code.

## Adding a new page
In Next.js, you create a new page by creating a new file in the `/src/pages` folder. Next will then automatically create a route for that page. For example, if you create a file `/src/pages/about.tsx`, you can access it by going to `localhost:3000/about`. Naming a file `index.tsx` will make it the default page for that route. For example, if you create a file `/src/pages/gig/index.tsx`, you can access it by going to `localhost:3000/gig`. This is (in this project) the preferred way of creating new pages.

We will now create a new page for our website. We will create a page which lists all the corps of Bleckhornen. This is a good example, as it will show you how to use Prisma and tRPC.

You should at any point be able to check the progress by going to [`localhost:3000/corps`](localhost:3000/corps).

### 1. Setting up the page

First, create a new file `/src/pages/corps/index.tsx`. Then, add the following code:

```tsx
import React from 'react';

const Corps = () => {
  return (
    <div>
      <h1>Corpsii</h1>
    </div>
  );
};

export default Corps;
```

This is a very simple page, which just renders a header with the text "Corpsii".

### 2. Fetching data from the database

Now, we need to add some data from our database to the page. We will use Prisma and tRPC to do this.

#### 2.1. Setting up tRPC/Prisma

In our [schema](/prisma/schema.prisma), we have the following definition for a corps:

```prisma
model Corps {
  id                    Int      @id @default(autoincrement())
  number                Int?
  firstName             String
  lastName              String
  isActive              Boolean  @default(true)
  vegetarian            Boolean  @default(false)
  vegan                 Boolean  @default(false)
  glutenIntolerant      Boolean  @default(false)
  lactoseIntolerant     Boolean  @default(false)
  nonDrinker            Boolean  @default(false)
  otherFoodRestrictions String   @default("")
  userId                String   @unique
  roleId                Int?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  hiddenGigs  HiddenGig[]
  gigSignups  GigSignup[]
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  instruments CorpsInstrument[]
  role        Role?             @relation(fields: [roleId], references: [id])
}
```

We will now use tRPC to query the database for all corps, and then render them on the page. First, we need to create a new file `/src/server/trpc/router/corpsExample.ts`. This file will contain the query for getting all corps. Add the following code:

```ts
import { router, publicProcedure } from "../trpc";

export const corpsExampleRouter = router({
  getCorpsii: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.corps.findMany();
    })
});
```

For every query we get a `ctx` object, which is a context object. This object contains a lot of useful information, such as the database client. This contains the `prisma` object, which we can use to query the database. In this case, we use the `findMany` function to get all corps. To see all the functions available, you can check out the [Prisma documentation](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference). If you are used to SQL, this is pretty similar.

The standard way to execute a query is therefore `ctx.prisma.<model>.<function>`. For example, if we wanted to get all corps with the first name "John", we would use `ctx.prisma.corps.findMany({ where: { firstName: "John" } })`.

Next, we add this router to our main tPRC router. Open `/src/server/trpc/router/_app.ts` and add the following lines:

```ts
// ... other router imports
import { corpsExampleRouter } from "./corpsExample";

export const appRouter = router({
  // ... other routers
  corpsExample: corpsExampleRouter,
});
```

This will define the router `corpsExample` in our main tRPC router, which we can import in our frontend.

#### 2.2. Fetching the data in the frontend

Now, we need to fetch the data in our frontend. Change the corps page to the following:

```tsx
import React from 'react';
import { trpc } from '../../utils/trpc';

const Corps = () => {

  const { data: corpsii } = trpc.corpsExample.getCorpsii.useQuery();

  return (
    <div>
      <h1>Corpsii</h1>
      {corpsii?.map((corps) => (
        <div key={corps.id}>
          <h2>{`${corps.number ? '#' + corps.number : 'p.e.'} ${corps.name}`}</h2>
        </div>
      ))}
    </div>
  );
};

export default Corps;
```

The `useQuery` call will automatically fetch and cache from the database into the `data` variable (here renamed to `corpsii`). We then map over the corps, and render them on the page.

Note! The `data` object will be `undefined` until the data is fetched, so make sure to handle that case. Above we use the [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) to check if `corpsii` is defined. If it is not, the entire expression will evaluate to `undefined`, and nothing will be rendered.

You should now be able to see all the corps on the page. If you want to manually view or edit the database, you can use [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio) to do so by running

```bash
npx prisma studio
```

This should open a new tab in your browser at `localhost:5555`.
