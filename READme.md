# ABCSafetyGroup LMS Web App

### Local Development

_Install packages_

> You can use **npm**, **pnpm** or **bun** for this. (bun is preferred)

```bash
bun install
```

_Environment Variables_

Take `.env.example` and copy and paste into a `.env.development` file, fill in according to use.

_Running_

```bash
bun dev
```

visit `localhost:3000` in your browser

#

### Run on Server

> Before building and running on server, we need to ensure it builds locally first.

```bash
npm run build
```

_Make sure all types are okay_

### Build and Run on Server

#### Development Version

```bash
./dev_build.sh
```

#### Production Version

```bash
./build.sh
```
