# Express Rest API

## 📖Description

This is a simple REST API with Express framework for Node.js, use mysql with prisma to store data.

## 🚀Installation
  ```bash
  npm install
  ```

## 📝Before you start

### Set Up Environment Variables

- Make sure you have [Node.js](https://nodejs.org) and [NPM](https://www.npmjs.com/) installed

- Before running the application, you need to set up the necessary environment variables.

   - Open the `.env.example` file in the root directory of your project.

   - Copy and paste the contents of the `.env.example` file into your `.env` file.

   - Save your changes.

### Migrate Database

- Run the following command to migrate the database.

  ```bash
  npm run migrate
  ```

## 🔭Running App
  ```bash
  # production
  npm start

  # development
  npm run start:dev
  ```

## 🚅Testing App

### Set Up Test Environment Variables

- To run the tests with another database, just copy and paste the contents of the `.env.test` file into your `.env` file.
- This an optional step.


To run the tests, use the following command:
  ```bash
  npm test
  ```

### Migrate Database

- Run the following command to migrate the database.

  ```bash
  npm run migrate:test
  ```