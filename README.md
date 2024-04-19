# MERN Stack Social Media Web Application

This is a social media web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to create accounts, post updates, follow other users, and interact with posts through comments and likes.

## Live Demo

Check out the live demo of the Social Media Web Application: [Live Demo](https://frontend-production-391c.up.railway.app/)

## Code Optimization

For an optimized version of the codebase, you can check out the `redux-data-fetch-refactor` branch. It contains code refinements and improvements. Additionally, it is the branch that is currently deployed for the live demo.

## Features

- **User Authentication:** Users can sign up, log in, and log out securely.
- **Post Creation and Interaction:** Users can create posts, like posts, and comment on posts.
- **User Profiles:** Each user has a profile page displaying their information and posts.
- **Follow System:** Users can follow/unfollow other users to see their posts in their feed.
- **Responsive Design:** The application is designed to work seamlessly across different devices and screen sizes.

## Technologies Used

- **MongoDB:** NoSQL database used to store user information, posts, comments, and likes.
- **Express.js:** Web application framework for building the backend server.
- **React.js:** Frontend library for building user interfaces.
- **Node.js:** JavaScript runtime for executing server-side code.
- **Redux:** State management library for managing application state.
- **Mongoose:** MongoDB object modeling tool used to interact with the database.
- **JWT (JSON Web Tokens):** Authentication method used to securely transmit information between parties.
- **Tailwind CSS:** A utility-first CSS framework for styling the UI.
- **DaisyUI:** A component library for Tailwind CSS that provides additional UI components and utilities.
- **Axios:** Promise-based HTTP client for making requests to the backend server.
- **Bcrypt.js:** Library used for hashing passwords before storing them in the database.
- **Cloudinary:** Cloud-based image and video management platform used for storing, managing, and delivering media assets in the application.
- **Zod:** JavaScript runtime data validation library for ensuring data integrity and consistency.

## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/IronJosh786/Social-Media-App.git
```

2. **Create .env in the backend's root directory and fill this with your credentials**

```bash
PORT,
CORS_ORIGIN,
MONGODB_URI,
ACCESS_TOKEN_SECRET,
ACCESS_TOKEN_EXPIRY,
REFRESH_TOKEN_SECRET,
REFRESH_TOKEN_EXPIRY,
CLOUDINARY_CLOUD_NAME,
CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET
```

3. **Change CORS Origin**
   Change the CORS Origin in "backend/src/app.js" to http://localhost:5173

4. **Change Base URL**
   Change the base variable in "frontend/src/baseUrl.js" to match the value specified in the .env file's PORT configuration.

5. **Install dependencies**

```bash
# Frontend

cd frontend
npm install

# Backend

cd backend
npm install
```

6. **Start the Server & Client**

```bash
# Backend

cd backend
npm start

# Frontend

cd frontend
npm run dev
```

7. **Open the application**

Open your browser and navigate to http://localhost:5173 to view the application.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

- Fork the repository
- Create your feature branch

```bash
git checkout -b feature/YourFeature
```

- Commit your changes

```bash
git commit -am 'Add some feature'
```

- Push to the branch

```bash
git push origin feature/YourFeature
```

- Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
