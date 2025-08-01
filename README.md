A robust blogging website with AI based blog generation
## Getting Started

To run the development server:

create `.env` file

```
BASE_URL=https://localhost:3000
POSTS_DIR=./posts
DATABASE_URL=mysql://root:secret@localhost:3306/saras

LOGIN_EMAIL=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_SECRET=
```

`AUTH_SECRET` can be generated by executing `openssl rand -base64 33`

`AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` can be generated from hithub

`NEXTAUTH_SECRET` are comma seperated allowed emails to login

```bash
# Migrate Database
pnpm dlx prisma migrate dev
# Run
pnpm dev --experimental-https
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> Note: The app depends on ssl (ie, https). So when running it on production use a proxy ssl server (example, nginx).

## Screenshots

![Screenshots](./screenshots/merged.png)
