# EmbrAlrt

## Description

EmbrAlert is a one-stop platform for wildfire detection, prevention, and community alerts, built for the diverse San Jose area and beyond. It offers real-time wildfire risk assessments, live weather and air quality updates, and a simple dashboard for users to interact with. Users can upload images of potential smoke, and our lightweight RNN model predicts wildfire likelihood. The app also features a multilingual chat tool powered by a custom RAG pipeline, supporting six languages common in San Jose, with both voice and text input. Live camera wildfire detection without uploads is also integrated for instant reporting.

## Contributors

Edwin Yue
Samson Xu
Sarthak Sethi
Tanzil Ahmed

## How to run

Server (backend)
port: 3001

1. cd server
2. npm i
3. npm run dev

Client (front end)
port: 5173

1. cd client

2. bash setup.sh

3. npm run dev

## Built with

- React

- Vite

- Python

- LangChain

- LangGraph

- RAG Pipeline Architecture

- Conventional RNN Model

- AstraDB Vector Database
