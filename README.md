

# 🏛️ Civiliscope

**Civiliscope** is a transparency platform dedicated to making U.S. Congress accessible and accountable to the American people.

Our mission is to promote congressional transparency by providing real-time data on current legislators, revealing lobbying connections, and empowering citizens with the information they need to hold their representatives accountable. Data sourced from [congress-legislators](https://github.com/unitedstates/congress-legislators).

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
* 💰 Lobbying influence tracking and visualization
* 🔍 Advanced search + filters by party/state/committee
* 📊 Voting record analysis and transparency tools
* 🗳️ Election countdown + polling overlays
* 📈 Legislative activity tracking over time
* 🤝 Corporate and special interest connections

---

## 👏 Credits

* Legislator data from [congress-legislators](https://github.com/unitedstates/congress-legislators)
* Built by Rahik Sikder (sikder.rahik@gmail.com)