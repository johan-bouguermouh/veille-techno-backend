# NestJS TodoList API

A project focused on conducting a technological watch to understand the advantages and disadvantages of the NestJS framework through the creation of an API for a todo list.

## Table of Contents

1. [Introduction](#introduction)

   - [Project Overview](#project-overview)
   - [Objective](#objective)

2. [Installation](#installation)

   - [Prerequisites](#prerequisites)
   - [Database Configuration](#database-configuration)
   - [Setup](#setup)

3. [Usage](#usage)

   - [Configuration](#configuration)
   - [Endpoints](#endpoints)
     - [API Documentation](#api-documentation)

4. [Running the App](#running-the-app)

   - [Development](#development)
   - [Watch Mode](#watch-mode)
   - [Production Mode](#production-mode)

5. [Packages](#packages)

   - [Dependencies](#dependencies)
   - [Installation of Packages](#installation-of-packages)

6. [Contributing](#contributing)

   - [Guidelines](#contribution-guidelines)
   - [Reporting Issues](#reporting-issues)

7. [License](#license)

8. [Acknowledgments](#acknowledgments)

## Introduction

### Project Overview

This project serves as a platform for conducting a technological watch, specifically focusing on evaluating the NestJS framework. The implementation involves creating a robust API for managing a todo list.

### Objective

The primary goal of this project is to explore and understand the advantages and disadvantages of NestJS in the context of building a todo list API. Through this endeavor, we aim to gain insights into the framework's features, performance, and suitability for real-world applications.

## Installation

### Prerequisites

Make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- A valid SQL server, either local or remote.

### Database Configuration

In the `.env` file, configure the following keys for your SQL server:

```nest
- DATABASE_HOST = '127.0.0.1'
- DATABASE_PORT = '3306'
- DATABASE_USER = 'root'
- DATABASE_PASSWORD = ''
- DATABASE_NAME = 'nestjs'
- JWT_SECRET = '98874814F23FCDD9F3ED978E8527A'
- SALT_ROUNDS = '$2b$10$O7nIevyFyqaRhv6l4calKu'
- CRYPTO_KEY = 'e/guPMuuvVEGvgkoGE9xtZMonJD+5ADJa1YwQ6ItUZSlpBFjjRYgRfYBZ45H4OWF'
```

**Note:** The script uses users' IP addresses hashed on the backend and encrypted on the frontend. Exercise caution for this usage, ensuring that the refreshToken cannot be usurped by a third party.

### Setup

Follow these steps to set up the project locally:

- Clone the repository:

```
gh repo clone johan-bouguermouh/veille-techno-backend
```

- Navigate to the project directory:

```bash
$ cd veille-techno-backend
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Usage

### Configuration

Adjust the configuration settings as needed. This may include environment variables, database connections, or any other project-specific settings.

### Endpoints

Document the available API endpoints and their functionalities here.

#### API Documentation

Access the Swagger documentation by navigating to the `/api` endpoint. This will provide detailed information about the available routes and DTOs for each entity.

## Running the App

To run the application in different modes, use the following commands:

### Development

- Run: `npm run start`

### Watch Mode

- Run: `npm run start:dev`

### Production Mode

- Run: `npm run start:prod`

## Packages

### Dependencies

List of dependencies used in this project:

- @nestjs/common: ^10.0.0
- @nestjs/config: ^3.1.1
- @nestjs/core: ^10.0.0
- @nestjs/jwt: ^10.2.0
- @nestjs/platform-express: ^10.0.0
- @nestjs/swagger: ^7.1.16
- @nestjs/typeorm: ^10.0.1
- bcrypt: ^5.1.1
- class-transformer: ^0.5.1
- class-validator: ^0.14.0
- mysql2: ^3.6.5
- reflect-metadata: ^0.1.13
- rxjs: ^7.8.1
- typeorm: ^0.3.17
- typeorm-extension: ^3.2.0

### Installation of Packages

To install project dependencies, run the following command:

```bash
npm install`
```

## Contributing

### Contribution Guidelines

If you'd like to contribute to the project, please follow the guidelines outlined in CONTRIBUTING.md.

### Reporting Issues

If you encounter any issues or have suggestions, please report them on the issue tracker.

## License

Nest is [MIT licensed](LICENSE).
