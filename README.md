# Miniblog Angular

This project uses [Angular CLI](https://github.com/angular/angular-cli) 22.x.

## Overview

Miniblog Angular is a small Angular 22 client for managing blog cards. The app lists blog entries, shows their publish status, and supports adding, editing, and deleting entries through a REST API.

Recent UI and data-flow changes include:

- Add and edit routes for blog cards.
- Delete support from the card detail form.
- Category selection loaded from the API.
- Draft and Publish status values with a colored status indicator on each card.
- Author username and password fields for the current lightweight author flow.
- Early authentication scaffolding in `AuthService` and `AuthInterceptor`; proper authentication is still a TODO.

## Requirements

- Node.js `^22.22.3 || ^24.15.0 || ^26.0.0`, plus npm. CI uses Node.js `24.15.0`.
- Angular CLI 22.x, available through the project dependency after `npm install`.
- A backend API running at `http://localhost:8081`.

The frontend currently calls these API routes:

- `GET /api/cards`
- `GET /api/cards/:id`
- `POST /api/cards`
- `PUT /api/cards`
- `DELETE /api/cards/:id`
- `GET /api/categories`

## Setup

Install dependencies:

```sh
npm install
```

## Development server

Run the app locally:

```sh
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

## Code scaffolding

Generate Angular code with:

```sh
npm run ng -- generate component component-name
```

You can also generate `directive`, `pipe`, `service`, `class`, `guard`, `interface`, `enum`, and `module` artifacts.

## Build

Build the project:

```sh
npm run build
```

The production build artifacts, including `index.html`, will be stored in `dist/miniblog-ang/browser/`. The default build configuration is production.

## Running unit tests

Run unit tests with [Karma](https://karma-runner.github.io) and Jasmine:

```sh
npm test
```

## End-to-end tests

This Angular 22 setup does not currently include an end-to-end test runner.

## Further help

To get more help on Angular CLI, run `npm run ng -- help` or see the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
