# Mrix Playground

<p align="justify">
Mrix Playground is a web environment for the mrix programming language, built with React, Vite, and Monaco Editor. It supports syntax highlighting and server-side code execution handled by Django REST Framework backend with JWT authentication, all running within Docker containers. Data is persisted using PostgreSQL database.
</p>

The core mrix language interpreter can be found [here](https://github.com/LeoonKameleon/mrix).

<img width="1920" height="1080" alt="2026-04-16 01-26-46 (3)" src="https://github.com/user-attachments/assets/f4de8d8c-02e5-49a6-8f93-018b941b9cca" />

# Requirements
+ Docker

# Build
Clone the repository:
```bash
git clone https://github.com/YourUsername/mrix-playground.git
cd mrix-playground
```

Build and start the environment:
```bash
docker compose up --build
```

# How to run
Access the interface at:
`http://localhost:5173`

API is available at:
`http://localhost:8000`
