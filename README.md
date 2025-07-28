

# 🏛️ Civiliscope

**Civiliscope** is a full-stack web app for visualizing the composition of the U.S. Congress — one seat at a time.

Hover over Senate seats to learn more about each legislator, with data sourced from [congress-legislators](https://github.com/unitedstates/congress-legislators). Easily extendable to the House of Representatives.

---

## 🏗️ Tech Stack

### ⚛️ Frontend
- **React (Vite, TypeScript)**
- **TailwindCSS** for styling
- **AWS Amplify** for hosting and CI/CD

### 🔙 Backend
- **Python 3.12**
- **Flask** (served via Gunicorn)
- **SQLAlchemy + PostgreSQL**
- **Data ingestion** from YAML via [congress-legislators](https://github.com/unitedstates/congress-legislators)
- **Docker + Docker Compose**
- **Deployed on AWS Elastic Beanstalk**

### 🔐 Authentication
- **Firebase Auth**

---

## 🧭 Directory Structure

````

.
├── frontend/             # React app
│   ├── src/
│   └── ...
├── backend/              # Flask API + DB logic
│   ├── app/
│   ├── data_ingestion/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
├── README.md             # ← You are here

````

---

## 🚀 Quick Start (Dev)

### 1. Clone the repo & submodules

```bash
git clone https://github.com/yourusername/civiliscope.git
cd civiliscope
git submodule update --init --recursive
````

### 2. Run the backend

```bash
cd backend
cp .env.example .env  # or create your own
docker compose up --build
```

> 💡 This will also ingest legislator data into the database automatically.

### 3. Run the frontend

```bash
cd ../frontend
yarn install
yarn run dev
```

---

## 🔮 Future Roadmap

* 🎯 Interactive House visualization
* 🔍 Search + filters by party/state
* 🗳️ Election countdown + polling overlays
* 📈 Visualize changes over time

---

## 👏 Credits

* Legislator data from [congress-legislators](https://github.com/unitedstates/congress-legislators)
* Built by Rahik Sikder (sikder.rahik@gmail.com)