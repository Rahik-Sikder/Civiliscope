import os
import yaml
from datetime import datetime
from app import create_app, db
from app.models import Senator, Representative

DATA_FILE = os.path.join(os.path.dirname(__file__), "congress/legislators-current.yaml")

def load_yaml():
    with open(DATA_FILE, "r") as f:
        return yaml.safe_load(f)

def parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()

def ingest():
    app = create_app()
    with app.app_context():
        print("Clearing existing data...")
        Senator.query.delete()
        Representative.query.delete()
        db.session.commit()

        print("Loading YAML...")
        legislators = load_yaml()

        for leg in legislators:
            full_name = leg["name"]["official_full"]
            bio = leg.get("bio", {}) # birthday, gender
            terms = leg["terms"]
            latest_term = terms[-1]

            if latest_term["type"] == "sen":
                senator = Senator(
                    full_name=full_name,
                    state=latest_term["state"],
                    party=latest_term["party"],
                    photo_url=None,  # can get this from bioguide later
                    term_start=parse_date(latest_term["start"]),
                    term_end=parse_date(latest_term["end"])
                )
                db.session.add(senator)

            elif latest_term["type"] == "rep":
                rep = Representative(
                    full_name=full_name,
                    state=latest_term["state"],
                    district=int(latest_term["district"]),
                    party=latest_term["party"],
                    photo_url=None,
                    term_start=parse_date(latest_term["start"]),
                    term_end=parse_date(latest_term["end"])
                )
                db.session.add(rep)

        db.session.commit()
        print("Ingestion complete.")

if __name__ == "__main__":
    ingest()
