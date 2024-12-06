# little boutik
This project consists of a technical test. A small application in React/FastAPI intended for tradesman.

## Backend

### Environnment file

You must create a .env file following the template and put the intended value.

### Activate Virtual Environment from Windows PS

```bash
.venv\Scripts\Activate.ps1
```

### Install Packages

```bash
pip install -r requirements.txt
```

### Run Live Server

```bash
fastapi dev main.py
```

## Frontend

### Install packages

```bash
npm install
```

### Run Live Server

```bash
npm start
```

## Docker

At the root of the project, run :

```bash
docker compose up --build
```

The app will be available at : http://localhost:3000/