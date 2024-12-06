# TanStackBlog
TanStack Blog Manager
This is a React Native app that uses TanStack Query for efficient server state management. It demonstrates CRUD operations with a mock API provided by JSONPlaceholder.

# Features
The app fetches a list of blog posts from a mock API. It allows users to create, update, delete, and filter posts by user ID. Posts are displayed in a scrollable and responsive list using React Native’s FlatList.

# Technologies
This project is built with React Native (using Expo), TanStack Query for server-state management, Axios for HTTP requests, and JSONPlaceholder as the mock API.

# Installation
To set up the project locally:

Clone the repository using git clone https://github.com/your-username/TanStackBlog.git.
Navigate to the project folder with cd TanStackBlog.
Install dependencies by running npm install.
Running the App
To start the app:

Run the command npx expo start.
Choose to run the app on the web browser or scan the QR code using the Expo Go app on your mobile device.
Features Demo
To create a new post, fill in the Title, Body, and User ID fields, and click "Create Post." The post will appear at the bottom of the list.

To filter posts by user ID, enter a valid User ID in the input field and click "Filter by User ID." The list will update to show posts for the specified user ID.

To reset filters, clear the User ID field and click "Filter by User ID." This will display all posts.

API Endpoints
The app interacts with the following API endpoints:

Fetch all posts: GET /posts
Create a new post: POST /posts
Filter posts by user ID: GET /posts?userId=<id>
Known Issues
JSONPlaceholder does not persist new posts. As a result, created posts will not survive a page refresh. Additionally, the API does not support real-time updates for all CRUD operations.

License
This project is licensed under the MIT License.
