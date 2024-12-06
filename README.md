<a href="https://fr.legacy.reactjs.org/" target="_blank"> 
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
</a>
<a href="https://fr.legacy.reactjs.org/" target="_blank"> 
    <img alt="React" src="https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white">
</a>

# Little Boutik
This project consists of a technical test. A small application in React/FastAPI intended for tradesman.

## Backend

### Environnment file

You must create a .env file following the template and put the intended value.

### Create and Activate Virtual Environment from Windows PS

```bash
python -m venv .venv
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

The login credentials are :
- Login: `admin`
- Password : `admin`