# Practice 3 – DriveDeal (Front-End Development I: SSR with Next.js + Tailwind CSS)

DriveDeal is a car marketplace built with Next.js and MongoDB.
The products sold are cars.

Authors: see `authors.txt`. Requirements and run instructions: see `requirements.txt`.

## Environment variables

The `.env*` files are not in the repository (they are listed in `.gitignore`),
so every developer must create their own **`.env.local`** in the project root
before running the app:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/drivedeal
SESSION_SECRET=replace-with-a-long-random-string
```

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `MONGODB_URI` | yes | Connection string of the MongoDB database. `drivedeal` is the database name; change host/port if your MongoDB runs elsewhere. |
| `SESSION_SECRET` | yes | Key used to sign the session JWT (HS256). Use a long random string (at least 32 characters) and never share or commit it. |

A random secret can be generated with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Optionally, a `.env` file with `NEXT_TELEMETRY_DISABLED=1` turns off Next.js
telemetry.

Changing `SESSION_SECRET` invalidates all existing sessions (users must sign in
again). Changing the database name in `MONGODB_URI` requires running
`npm run seed` again.

## Run

```bash
npm install
npm run seed
npm run dev
```

The seeder prints the IDs of the two sample users and the sample cars.

| User | E-mail | Password |
| ---- | ------ | -------- |
| John Doe | `johndoe@example.com` | `1234` |
| Jane Smith | `janesmith@example.com` | `5678` |

Passwords are stored hashed with bcrypt. `SESSION_SECRET` (used to sign the
JWT) is defined in `.env.local`.

## Authentication and authorization

- `POST /api/auth/signin` checks e-mail + password and, on success, sets the
  `session` cookie (JWT signed with HS256, `httpOnly`, valid 7 days).
- `POST /api/auth/signout` removes the cookie (204).
- Every endpoint under `/api/users/[userId]/...` requires a signed-in user and
  the `userId` of the URL must be the signed-in user. Checks, in this order:
  **401** `NOT_AUTHENTICATED` (no valid session) -> **400** `WRONG_PARAM`
  (invalid ID) -> **403** `NOT_AUTHORIZED` (another user's resources).
  The logic lives in `src/lib/authorization.ts`.
- Public endpoints: products, user registration, sign in and sign out.

## REST API

| Method | Path | Auth | Success | Errors |
| ------ | ---- | ---- | ------- | ------ |
| POST | `/api/auth/signin` | public | 200 + session cookie | 400 missing params / wrong credentials |
| POST | `/api/auth/signout` | public | 204 | – |
| GET | `/api/products` | public | 200 | – |
| GET | `/api/products/[productId]` | public | 200 | 400 invalid product ID, 404 product not found |
| POST | `/api/users` | public | 201 + `Location` | 400 invalid body / e-mail already in use |
| GET | `/api/users/[userId]` | owner | 200 | 401, 400 invalid user ID, 403, 404 user not found |
| GET | `/api/users/[userId]/cart` | owner | 200 | 401, 400, 403, 404 |
| PUT | `/api/users/[userId]/cart/[productId]` | owner | 200 updated / 201 created + `Location` | 401, 400 invalid user ID / product ID / qty, 403, 404 user / product not found |
| DELETE | `/api/users/[userId]/cart/[productId]` | owner | 200 | 401, 400 invalid user ID / product ID, 403, 404 |
| GET | `/api/users/[userId]/orders` | owner | 200 | 401, 400, 403, 404 |
| POST | `/api/users/[userId]/orders` | owner | 201 + `Location` | 401, 400 invalid user ID / body / empty cart, 403, 404 |
| GET | `/api/users/[userId]/orders/[orderId]` | owner | 200 | 401, 400 invalid user ID / order ID, 403, 404 user / order not found |

Every error response has the form `{ "error": "...", "message": "..." }`.

## Testing with Postman

Run `npm run seed`, import
`postman/DriveDeal.postman_collection.json` and run the whole
collection in order. Postman keeps the session cookie automatically and every
request has a test for the expected status code.


## Practice 3: pages

Server-rendered pages: `/`, `/products/[productId]`, `/cart`, `/checkout`,
`/profile`, `/orders/[orderId]` (layout with navbar/header/footer in
`src/app/(sections)/`). `/auth/signin` and `/auth/signup` are placeholders with
their own layout. Sign in/out via the DevTools console (see Seminar 3, slide 26).
The seeder creates no orders: create some with Postman.
