# clubwebsite
Welcome to the ClubConnect repository. This documentation will guide you through the process of setting up and running the project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (https://nodejs.org/)
- npm (https://www.npmjs.com/)
- MongoDB (https://www.mongodb.com/)

## Setting Up the Backend Server

1. **Navigate to the server directory:**

   ```sh
   cd server
   
2. **Install the dependencies:**

   ```sh
   npm install

3. **Configure the environment variables:**
   Create a .env file in the server directory and add the following environment variables. Replace the placeholders (YOUR_PORT, YOUR_MONGO_URL, YOUR_ACCESS_TOKEN_SECRET, YOUR_REFRESH_TOKEN_SECRET) with your own values:

   ``PORT=YOUR_PORT``
   ``MONGOURL="YOUR_MONGO_URL"``
   ``ACCESS_TOKEN_SECRET="YOUR_ACCESS_TOKEN_SECRET"``
   ``ACCESS_TOKEN_EXPIRY=1d``
   ``REFRESH_TOKEN_SECRET="YOUR_REFRESH_TOKEN_SECRET"``
   ``REFRESH_TOKEN_EXPIRY=10d``

4. **Start the backend server:**

   ```sh
   npx nodemon index.js

## Setting Up the Frontend

1. **Navigate to the client directory:**

   ```sh
   cd client
   
2. **Install the dependencies:**

   ```sh
   npm install
   
3. **Configure the environment variables:**
   Create a .env file in the client directory and add your Firebase storage connection string. Replace the placeholder with your Firebase API key.`

   ``VITE_FIREBASE_API_KEY="your_firebase_api_key"``

4. **Start the Frontend server:**

   ```sh
   npm run dev

## Running the Project
With both the backend and frontend servers running, you should be able to access the application through your web browser.

Notes
Ensure your MongoDB server is running and accessible.
Update the MongoDB connection string in the .env file as per your database configuration.
If you encounter any issues, check the console logs for error messages and resolve them accordingly.


To add this to your `README.md` file:

1. Open your terminal in VS Code.
2. Navigate to the root directory of your project if you are not already there.
3. Open or create the `README.md` file by running:

   ```sh
   code README.md
4. Copy the markdown content provided above and paste it into the README.md file in the VS Code editor.
5. Save the file (Ctrl+S or Cmd+S).
6. Commit and push the changes to your GitHub repository:
   ```sh
    git add README.md
    git commit -m "Add project documentation to README.md"
    git push origin main
