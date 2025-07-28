from flask import Blueprint, jsonify
from external_api.services import get_member_details, get_current_congress

bp = Blueprint("congress", __name__, url_prefix="/api/congress")


@bp.route("/current", methods=["GET"])
def get_current_congress_info():
    """Get current Congress information from Congress.gov API."""
    congress_data = get_current_congress()

    if congress_data is None:
        return jsonify({"error": "Current congress information not available"}), 404

    return jsonify(congress_data)

