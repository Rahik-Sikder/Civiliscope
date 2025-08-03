from flask import Blueprint, jsonify

from external_api.services import (
    get_bill_actions_service,
    get_bills_for_current_congress,
    get_current_congress,
)

bp = Blueprint("congress", __name__, url_prefix="/api/congress")


@bp.route("/current", methods=["GET"])
def get_current_congress_info():
    """Get current Congress information from Congress.gov API."""
    congress_data = get_current_congress()

    if congress_data is None:
        return jsonify({"error": "Current congress information not available"}), 404

    return jsonify(congress_data)


@bp.route("/bills", methods=["GET"])
def get_bills():
    """Get bills for the current Congress from Congress.gov API."""
    bills_data = get_bills_for_current_congress()

    if bills_data is None:
        return jsonify({"error": "Bills information not available"}), 404

    return jsonify(bills_data)


@bp.route(
    "/bills/<int:congress>/<bill_type>/<int:bill_number>/actions", methods=["GET"]
)
def get_bill_actions(congress: int, bill_type: str, bill_number: int):
    """Get actions for a specific bill from Congress.gov API."""
    # Validate bill_type - common bill types in Congress
    valid_bill_types = {
        "hr",
        "s",
        "hjres",
        "sjres",
        "hconres",
        "sconres",
        "hres",
        "sres",
    }
    if bill_type.lower() not in valid_bill_types:
        return jsonify(
            {
                "error": f"Invalid bill type '{bill_type}'. Valid types are: {', '.join(valid_bill_types)}"
            }
        ), 400

    # Validate congress number (should be reasonable)
    if congress < 1 or congress > 200:  # Reasonable bounds
        return jsonify(
            {
                "error": f"Invalid congress number '{congress}'. Must be between 1 and 200."
            }
        ), 400

    # Validate bill number (should be positive)
    if bill_number < 1:
        return jsonify(
            {
                "error": f"Invalid bill number '{bill_number}'. Must be a positive integer."
            }
        ), 400

    actions_data = get_bill_actions_service(congress, bill_type.lower(), bill_number)

    if actions_data is None:
        return jsonify(
            {
                "error": f"Actions not available for bill {bill_type.upper()}{bill_number} in Congress {congress}"
            }
        ), 404

    return jsonify(actions_data)
