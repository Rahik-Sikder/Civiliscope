from . import db


class Legislator(db.Model):
    __abstract__ = True
    bioguide_id = db.Column(db.String(7), primary_key=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    party = db.Column(db.String(20), nullable=False)
    photo_url = db.Column(db.String(255))
    term_start = db.Column(db.Date)
    term_end = db.Column(db.Date)


class Senator(Legislator):
    __tablename__ = "senators"
    seat_number = db.Column(db.Integer)


class Representative(Legislator):
    __tablename__ = "representatives"
    district = db.Column(db.Integer, nullable=False)
