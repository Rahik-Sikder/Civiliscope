#!/bin/sh

echo "Running legislator ingestion..."
python -m data_ingestion.parse_legislators

echo "Starting Flask app with Gunicorn..."
exec gunicorn --bind 0.0.0.0:5000 run:app
