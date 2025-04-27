# EmbrAlert

EmbrAlert is a full-stack wildfire detection, prevention, and community alert application designed for the diverse San Jose area and beyond. It provides real-time wildfire risk assessments, weather and air quality updates, AI-driven smoke detection, multilingual chatbot support, and live camera wildfire detection.

> 🛠️ This project was built during **SJHacks**, a 24-hour hackathon hosted in San Jose, California. Our goal was to create a proactive solution to help communities detect and prevent wildfires before they spread.

## Features
- 🔥 Real-time wildfire risk prediction using a lightweight RNN model
- 🌎 Live weather and air quality data dashboard
- 📸 Upload images or use live camera for instant smoke detection
- 💬 Multilingual chat system powered by a custom RAG pipeline (supports six languages)
- 🎙️ Voice and text input capabilities
- 🌐 Optimized for both web and mobile devices
---

## Getting Started

### Prerequisites
- Node.js and npm installed
- Python 3.x installed
- AstraDB (or another vector database access)

---

## Installation

### Backend (Server)

1. Open a terminal and navigate to the `/server` directory:
    ```bash
    cd server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm run dev
    ```

4. Server will run at:
    ```
    http://localhost:3001
    ```

---

### Frontend (Client)

1. Open another terminal and navigate to the `/client` directory:
    ```bash
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    npm install lucide-react
    ```

3. Start the client:
    ```bash
    npm run dev
    ```

4. Client will run at:
    ```
    http://localhost:5173
    ```

---

## Usage
- Access the app at [http://localhost:5173](http://localhost:5173)
- The app will automatically connect to the backend server running at [http://localhost:3001](http://localhost:3001)

---

## Future Plans
- Public launch with emergency authority integration
- Expand the RNN model with additional wildfire datasets
- Add support for additional languages
- Deploy scalable versions for wildfire-prone areas globally

---

## License
MIT License. Feel free to fork and build upon EmbrAlert!


--- 

## Team

Sarthak Sethi 
Edwin Yue
Samson Xu
Tanzil Ahmed
