# Mrix Playground

<p align="justify">
Mrix Playground is a web environment for the rix programming language, built with React, Vite, and Monaco Editor. It supports syntax highlighting and server-side code execution handled by Django REST Framework backend with JWT authentication, all running within Docker containers. Data is persisted using PostgreSQL database.
</p>

The core mrix language interpreter can be found [here](https://github.com/LeoonKameleon/mrix).

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