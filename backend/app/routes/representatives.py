from flask import Blueprint, jsonify
from ..models import Representative

bp = Blueprint('representatives', __name__, url_prefix='/api/representatives')

@bp.route('/', methods=['GET'])
def get_all_reps():
    reps = Representative.query.order_by(Representative.last_name).all()
    return jsonify([{
            "id": r.id,
            "name": r.full_name,
            "state": r.state,
            "district": r.district,
            "party": r.party,
            "photo_url": r.photo_url,
        } for r in reps])

@bp.route("/<int:representative_id>", methods=["GET"])
def get_senator(representative_id):
    rep = Representative.query.get_or_404(representative_id)
    return jsonify({
        "id": rep.id,
        "name": rep.full_name,
        "state": rep.state,
        "district": rep.district,
        "party": rep.party,
        "term_start": rep.term_start,
        "term_end": rep.term_end,
        "photo_url": rep.photo_url,
    })