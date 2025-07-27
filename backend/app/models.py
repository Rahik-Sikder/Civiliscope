from . import db


class Senator(db.Model):
    __tablename__ = "senators"
    id = db.Column(db.Integer, primary_key=True)
    bioguide_id = db.Column(db.String(7), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    party = db.Column(db.String(20), nullable=False)
    photo_url = db.Column(db.String(255))
    term_start = db.Column(db.Date)
    term_end = db.Column(db.Date)
    seat_number = db.Column(db.Integer)


class Representative(db.Model):
    __tablename__ = "representatives"
    id = db.Column(db.Integer, primary_key=True)
    bioguide_id = db.Column(db.String(7), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    district = db.Column(db.Integer, nullable=False)
    party = db.Column(db.String(20), nullable=False)
    photo_url = db.Column(db.String(255))
    term_start = db.Column(db.Date)
    term_end = db.Column(db.Date)
