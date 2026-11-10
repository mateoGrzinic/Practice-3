# Practice 3 – DriveDeal (Front-End Development I: SSR with Next.js + Tailwind CSS)

Car marketplace (similar to AutoScout24) built with Next.js and MongoDB.
The products sold are cars.

Authors: see `authors.txt`. Requirements and run instructions: see `requirements.txt`.

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
