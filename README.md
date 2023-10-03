# ScreenRecordAPI

# SCREEN RECORD API BACKEND

Backend for the CHrome Record Sessions API. 

## Table of Contents
  - [Project Configuration](#project-configuration)
- [Getting Started](#getting-started-running-the-server)
  - [Tech Stack](#tech-stack)
  - [Testing](#testing)
- [Endpoints](#endpoints) 
  - [APIs](#apis) 
  - [Request](#request) 
  - [Response](#response) 
  - [Response Status](#response-status) 
- [License](#license)
- [Documentation](#documentation)
- [Links](#links)
- [The Author](#the-author)


## 📁 Project Configuration

The project is divided into:

- Controllers: found in `src/controller` folder. Coordinates the interaction between the UI and the backend services.

- Model: found in `src/models` directory. Database Schema of the events app.

- Routes: found in `src/routes` directory. URL endpoints and their corresponding method/action.


## Getting Started: Running the Server

### 🔧 Tech Stack

- NodeJS
- ExpressJS
- MongoDB

### 📝 Requirements

This project requires nodeJS version >= 14 and npm package manager.

### 💻 Running Locally

1. Clone this repository by running:
   ```bash
   git clone https://github.com/highb33kay/ScreenRecordAPI
   cd ScreenRecordAPI
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Using the `.env_sample` template, create a `.env` file and fill in the values for each environment variables.
4. Start the server in dev mode:
   ```bash
   npm run build
   ```


### 💻 Live Server

The live server is running on:

```bash
ec2-16-171-60-220.eu-north-1.compute.amazonaws.com:3000/
```

Alternatively, online API testing tools such as **Postman** can be used to test the endpoints.


## 🌐 Endpoints

### apis

The ChromeEVents app backend provides the following APIs:

## 🌐 Endpoints


- GET `http://ec2-16-171-60-220.eu-north-1.compute.amazonaws.com:3000/api/start-recording`
- POST `ec2-16-171-60-220.eu-north-1.compute.amazonaws.com:3000/api/stream-recording/:sessionID`
- POST `ec2-16-171-60-220.eu-north-1.compute.amazonaws.com:3000/api/stop-recording/:sessionID`
- GET `ec2-16-171-60-220.eu-north-1.compute.amazonaws.com:3000/api/stream/:sessionID`


### 📩 Request

- Accepts JSON only.
- Request body should **only** contain the specified values and follow the database schema.
- Example request:
  ```json
  {
    "name": "NAME"
  }
  ```

### 📂 Response

Returns JSON.

### ⚠️ Response Status

- 200 - OK: User or resource has been successfully updated.
- 201 - Created: User or resource has been successfully created.
- 400 - Bad Request:
  - Request body has more than the specified attribute.
  - Invalid content-Type.
- 403 - Unauthorized: A user is not authenticated
- 404 - User or Resource Not Found.
- 500 - Internal Server Error.


## 📄 License

This project uses the MIT License as found in [LICENSE](/LICENSE)

## 📖 Documentation


Documentation can be found in `/api-docs` endpoint.



Documentation can be found [here](ec2-16-171-60-220.eu-north-1.compute.amazonaws.com:3000/api-docs/)


## 🔗 Links

* [Server URL](ec2-16-171-60-220.eu-north-1.compute.amazonaws.com:3000/)

## 🤝 The Author

Built by HIGHB33KAY
