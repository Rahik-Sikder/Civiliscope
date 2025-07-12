from flask import Blueprint, jsonify
from ..models import Senator

bp = Blueprint('senators', __name__, url_prefix='/api/senators')

@bp.route('/', methods=['GET'])
def get_all_senators():
    senators = Senator.query.all()
    # Can modify s.to_dict() to return only specific fields if needed
    return jsonify([{
            "id": s.id,
            "name": s.full_name,
            "state": s.state,
            "party": s.party,
            "photo_url": s.photo_url
        } for s in senators])

@bp.route("/<int:senator_id>", methods=["GET"])
def get_senator(senator_id):
    senator = Senator.query.get_or_404(senator_id)
    return jsonify({
        "id": senator.id,
        "name": senator.full_name,
        "state": senator.state,
        "party": senator.party,
        "term_start": senator.term_start,
        "term_end": senator.term_end,
        "photo_url": senator.photo_url
    })