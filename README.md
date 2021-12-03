# MongoDB Express Preact Node Auth

----

## Back-end {User auth with Refresh Tokens}
uses 
- jsonwebtoken 
- bcrypt
- cookieParser

----

## Front-end {Private Routes and Preact Hooks}
uses
- Preact framework (lightweight react alterantive only 3kb)
- WindiCSS (Tailwind but Fasst!)

----

Installation Server (from root)
```bash
    cd server
    pnpm install
```

Installation Client (from root)
```bash
    cd client
    pnpm install
```

Make one .env file in client dir and one in server dir

server/.env
```
MONGO_URI = {database connection url}
WHITELISTED_DOMAINS = {front-end port}
JWT_SECRET = {secret string for jwt tokens}
REFRESH_SECRET =  {a different secret string for refresh tokens}
COOKIE_SECRET =  {one more secret string for signing cookies}
```

client/.env
```
VITE_BASE_URL = {back-end port}
```

Run pnpm dev on both client and server dir
```bash
    pnpm dev
``` 