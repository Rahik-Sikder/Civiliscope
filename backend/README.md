## `backend/README.md`

# Civiliscope Backend

The backend service powering Civiliscope — a visual and interactive platform for exploring U.S. Congressional seats. This Flask-based API exposes structured data on Senators and Representatives using a SQLite database and data from the [congress-legislators](https://github.com/unitedstates/congress-legislators) project.

---

## ⚙️ Tech Stack

- **Python 3.12**
- **Flask** (served via Gunicorn)
- **SQLAlchemy** for ORM
- **SQLite** for data storage
- **Docker + Docker Compose** for containerized setup
- **Data ingestion** via YAML parser and Git submodules

---

## 🚀 Setup Instructions

### 1. Clone the repository and submodules

```bash
git clone https://github.com/yourusername/civiscope.git
cd civiscope
git submodule update --init --recursive
```

### 2. Create `.env` file inside `backend/`

```bash
cd backend
touch .env
```

And add:

```env
FRONTEND_URL=http://localhost:3000
# DATABASE_URL is optional - defaults to SQLite at instance/civiliscope.db
```

---

### 3. Build and start the containers

```bash
docker compose up --build
```

This will:

* Build the Flask container
* Automatically run the legislator parser to populate the DB
* Launch the Flask API server on port `5050`

---

### 4. Verify the data

To check that senators/representatives were added, use the API:

```bash
curl http://localhost:5050/api/senators
curl http://localhost:5050/api/representatives
```

Or check the SQLite database directly:

```bash
docker compose exec backend sqlite3 instance/civiliscope.db
```

Then inside `sqlite3`:

```sql
.tables
SELECT * FROM senators LIMIT 5;
SELECT * FROM representatives LIMIT 5;
```

Or use:

```bash
curl http://localhost:5050/api/senators
```

---

## 🧪 Developer Utilities

* Build the containers:

```bash
docker compose up --build
```

* Remove the containers - reset db:

```bash
docker compose down -v
```

* Re-run parser manually:

```bash
docker compose exec backend python -m data_ingestion.parse_legislators
```

* Access shell inside backend container:

```bash
docker compose exec backend sh
```

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── models.py
│   ├── services/
│   └── routes/
├── data_ingestion/
│   ├── __init__.py
│   ├── parse_legislators.py
│   └── congress/       # submodule
├── start.sh            # runs parser + starts Flask
├── requirements.txt
├── Dockerfile
├── .env
```

---

## 📄 License & Acknowledgments

* Data sourced from [congress-legislators](https://github.com/unitedstates/congress-legislators)
* Developed by Rahik Sikder (sikder.rahik@gmail.com)



