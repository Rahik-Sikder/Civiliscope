#!/bin/sh

echo "Environment: $FLASK_ENV"

echo "Running legislator ingestion..."
python -m data_ingestion.parse_legislators

echo "Starting Flask app with Gunicorn..."
exec gunicorn --bind 0.0.0.0:5000 --timeout 300 --workers 2 run:app

