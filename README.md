# WebTrigger: minimalistic webhook service

WebTrigger is a service that simplifies webhook management and includes basic filtering. It is built using [Elysia.js][elysiajs] and [PostgreSQL][postgresql].

Small usage example: https://github.com/dev5c32373043/webtrigger-example

## Getting started

To start the project install all dependencies in requrements section.
Add `.env` or `.env.local` file (`.env.example` as an example)

Install packages:

```bash
bun install
```

Create database and run migrations:

```bash
bunx prisma migrate dev --name init
```

And finally start the dev server:

```bash
bun run dev
```

## Requirements

- [Bun.js][bun] 1.0.0+
- [Elysia.js][elysiajs] 0.6.24+
- [PostgreSQL][postgresql] 12.11+

[bun]: https://bun.sh/
[elysiajs]: https://elysiajs.com/
[postgresql]: https://www.postgresql.org/
