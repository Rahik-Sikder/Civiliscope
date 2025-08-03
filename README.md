

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
- **SQLAlchemy + SQLite**
- **Data ingestion** from YAML via [congress-legislators](https://github.com/unitedstates/congress-legislators)
- **Docker + Docker Compose**
- **Deployed on AWS Elastic Beanstalk**

### 🔐 Authentication
- **Firebase Auth**

---

## 🧭 Directory Structure

```
.
├── .github/workflows/    # GitHub Actions CI/CD
├── frontend/             # React app (Vite + TypeScript)
│   ├── src/components/   # Reusable UI components
│   ├── src/pages/        # Route-based page components
│   ├── src/services/     # API client services
│   └── src/hooks/        # Custom React hooks
├── backend/              # Flask API + SQLite DB
│   ├── app/              # Flask application
│   ├── data_ingestion/   # YAML parsing & web scraping
│   ├── tests/            # API integration tests
│   ├── instance/         # SQLite database storage
│   └── docker-compose.yml
└── README.md             # ← You are here
```

---

## 🚀 Quick Start (Dev)

### 1. Clone the repo & submodules

```bash
git clone https://github.com/Rahik-Sikder/Civiliscope.git
cd Civiliscope
git submodule update --init --recursive
```

### 2. Run the backend

```bash
cd backend
touch .env  # Create empty .env file (optional - defaults work)
docker compose up --build
```

> 💡 This will also ingest legislator data into the database automatically.

### 3. Run the frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧪 Testing & Development

### Running Tests
```bash
cd backend
python run_tests.py all
```

### Code Quality
```bash
cd backend
ruff check .      # Linting
ruff format .     # Code formatting
```

### Continuous Integration
- GitHub Actions automatically runs tests on pull requests
- Includes linting, formatting, and API integration tests
- Uses SQLite for simplified test environment

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
