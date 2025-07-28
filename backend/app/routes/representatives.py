from flask import Blueprint, jsonify
from ..models import Representative

bp = Blueprint("representatives", __name__, url_prefix="/api/representatives")


@bp.route("/", methods=["GET"])
def get_all_reps():
    reps = Representative.query.order_by(Representative.last_name).all()
    return jsonify(
        [
            {
                "bioguide_id": r.bioguide_id,
                "name": r.full_name,
                "state": r.state,
                "district": r.district,
                "party": r.party,
                "photo_url": r.photo_url,
            }
            for r in reps
        ]
    )


# Limited usecase - default to member api
@bp.route("/<string:bioguide_id>", methods=["GET"])
def get_representative(bioguide_id):
    rep = Representative.query.get_or_404(bioguide_id)
    return jsonify(
        {
            "bioguide_id": rep.bioguide_id,
            "name": rep.full_name,
            "state": rep.state,
            "district": rep.district,
            "party": rep.party,
            "term_start": rep.term_start,
            "term_end": rep.term_end,
            "photo_url": rep.photo_url,
        }
    )
