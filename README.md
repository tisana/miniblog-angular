# Miniblog Angular

This project uses [Angular CLI](https://github.com/angular/angular-cli) 20.x.

## Overview

Miniblog Angular is a small Angular 20 client for managing blog cards. The app lists blog entries, shows their publish status, and supports adding, editing, and deleting entries through a REST API.

Recent UI and data-flow changes include:

- Add and edit routes for blog cards.
- Delete support from the card detail form.
- Category selection loaded from the API.
- Draft and Publish status values with a colored status indicator on each card.
- Author username and password fields for the current lightweight author flow.
- Early authentication scaffolding in `AuthService` and `AuthInterceptor`; proper authentication is still a TODO.

## Requirements

- Node.js `^20.19.0`, `^22.12.0`, or `^24.0.0`, plus npm.
- Angular CLI 20, available through the project dependency after `npm install`.
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

The build artifacts will be stored in `dist/miniblog-ang/`. The default build configuration is production.

## Running unit tests

Run unit tests via [Karma](https://karma-runner.github.io):

```sh
npm test
```

## End-to-end tests

This Angular 20 setup does not currently include an end-to-end test runner.

## Further help

To get more help on Angular CLI, run `npm run ng -- help` or see the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
