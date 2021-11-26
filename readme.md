# Fitness API 


This service provides endpoints for users to signup and track their in-take food calories and to see if it's violating their goal

## Pre-requisites
---
1. Node >= 14.x.x
2. npm >= 6.x.x
3. MariaDB Server

## Installation
---
1. Clone the project into your machine and navigate to the project
2. Install dependencies using `npm install`
3. Add `.env` file under `src/` with appropriate values (refer `example.env`)
4. Run the service using `npm start` (database is enough, tables will be created on service start)

## Running tests
---
1. Add `test.env` file under `test/` (refer : `test_example.env`)
2. To run unit tests: `npm test` or `npm run test`
3. To run E2E tests: `npm run test:e2e`
4. To run both unit and E2E tests: `npm run test:all`
5. To run for code coverage: `npm run coverage`