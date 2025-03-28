<img src="https://github.com/user-attachments/assets/f9b1bff9-9aca-4d76-8dd5-1ea2b4d6286a">
<img width="1415" alt="Screenshot 2025-03-28 at 3 25 20 PM" src="https://github.com/user-attachments/assets/87a50a83-1c2b-4cab-b0ee-09d68dc32349" />

# ABCSafetyGroup LMS Web App
http://abcsafetygroup.com

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
