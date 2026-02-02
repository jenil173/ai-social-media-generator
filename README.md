🍽️ Restaurant Voice Booking Assistant

A voice-enabled restaurant booking system that allows users to book tables using natural speech, receive weather-based seating suggestions, and store booking data securely in MongoDB Atlas.

This project simulates a real-world restaurant voice receptionist using modern web technologies.



📌 Project Overview

The Restaurant Voice Booking Assistant provides a smooth, human-like conversational experience where users can:

Speak naturally to book a table

Provide flexible inputs (date, guests, time, cuisine)

Receive real-time weather-based seating suggestions

Confirm, cancel, or restart bookings safely

Store booking data securely in MongoDB

The system is designed to handle imperfect speech and real human conversation patterns.



✨ Key Features
🎙️ Voice Interaction

Speech-to-Text using Web Speech API

Text-to-Speech responses

Hands-free booking experience

🧠 Smart Conversation Engine

Step-by-step guided conversation flow

No infinite loops or stuck states

Handles unclear or partial speech

Supports booking cancellation & restart

📅 Intelligent Date Recognition

Supports flexible date formats such as:

February 14

14 February

Feb 15

tomorrow

next Sunday

after 5 days

Automatically converts speech into valid future dates.

🌦 Weather Integration

Real weather data via OpenWeatherMap API

Future date weather estimation

Temperature shown in Celsius

Weather-based seating recommendations

Example response:
The weather on your booking day is expected to be around 31°C with clear sky.

🪑 Seating Recommendation

Indoor or outdoor seating suggestions

Based on weather and temperature

User preference always respected

💾 Booking Storage

MongoDB Atlas database

Stores complete booking details

Booking status tracking (confirmed / cancelled)

🔁 Error Handling & Stability

Handles invalid or unclear speech input

Safe fallback messages

Conversation reset without crashes



🛠 Tech Stack
Frontend

React.js

Web Speech API

CSS

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

External API

OpenWeatherMap API



⚙ Environment Setup

Create a .env file inside the server folder with the following variables:

PORT = 5000
MONGODB_URI = your_mongodb_connection_string
WEATHER_API_KEY = your_openweather_api_key
DEFAULT_LAT = 22.3039
DEFAULT_LON = 70.8022
NODE_ENV = development

⚠ Important
Never upload the .env file to GitHub.
Make sure .env is listed in .gitignore.


▶ How to Run the Project
Backend (Server)

Open terminal

Navigate to the server folder
restaurant-voice-booking/server

Install dependencies
Run: npm install

Start the backend server
Run: npm run dev

Backend runs at:
http://localhost:5000/api

Frontend (Client)

Open a new terminal

Navigate to the client folder
restaurant-voice-booking/client

Install dependencies
Run: npm install

Start the frontend
Run: npm start

Frontend runs at:
http://localhost:3000

🎤 Sample Conversation

Agent: Hello! Welcome to our restaurant. May I have your name please?
User: Ajay

Agent: How many guests will be joining you?
User: two people

Agent: When would you like to book your table?
User: next Sunday

Agent: What time would you prefer?
User: 7 PM

Agent: Which cuisine would you like?
User: Italian

Agent: Is this booking for a special occasion?
User: birthday

Agent: The weather is expected to be around 31°C with clear sky.
Agent: Indoor seating would be more comfortable.

Agent: Please confirm your booking.
User: yes

Agent: Your booking has been confirmed successfully.

🌐 Browser Support

Google Chrome ✅

Microsoft Edge ✅

Voice recognition works best on Chromium-based browsers.

🎯 Use Cases

Restaurant table booking system

Smart voice receptionist

Voice-based kiosk application

AI customer support prototype

📘 What This Project Demonstrates

Voice UI development

Conversational system design

Weather-based decision making

Full-stack application architecture

MongoDB Atlas integration

Error-resilient real-world flow

👨‍💻 Author

Jenil Gajipara
Frontend & MERN Stack Developer


📄 License

This project is created for educational and learning purposes.
