from flask import Blueprint, jsonify
from external_api.services import get_member_details

bp = Blueprint("members", __name__, url_prefix="/api/members")


@bp.route("/<bioguide_id>", methods=["GET"])
def get_member(bioguide_id):
    """Get detailed member information from Congress.gov API by bioguide ID."""
    member_data = get_member_details(bioguide_id)

    if member_data is None:
        return jsonify({"error": "Member not found"}), 404

    return jsonify(member_data)
