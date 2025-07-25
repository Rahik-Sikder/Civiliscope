#!/bin/bash

echo "=== Testing API endpoints with curl ==="
echo

echo "1. Testing GET /api/senators/"
echo "URL: http://localhost:5050/api/senators/"
echo "Response:"
curl -v -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     http://localhost:5050/api/senators/
echo
echo

echo "2. Testing OPTIONS /api/senators/ (CORS preflight)"
echo "URL: http://localhost:5050/api/senators/"
echo "Response:"
curl -v -X OPTIONS \
     -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     http://localhost:5050/api/senators/
echo
echo

echo "3. Testing with browser-like headers"
echo "URL: http://localhost:5050/api/senators/"
echo "Response:"
curl -v -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -H "Origin: http://localhost:5173" \
     -H "Referer: http://localhost:5173/" \
     -H "User-Agent: Mozilla/5.0 (Test)" \
     http://localhost:5050/api/senators/
echo