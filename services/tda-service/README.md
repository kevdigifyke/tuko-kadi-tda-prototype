# Python TDA Service

Lightweight local FastAPI service for generating topology graph JSON from synthetic election-like feature data.

## Endpoints
- `GET /health`
- `POST /generate-graph`
- `GET /graph-summary`

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8010
```

## Export frontend graph
```bash
curl -X POST http://127.0.0.1:8010/generate-graph \
  -H 'Content-Type: application/json' \
  -d '{"sample_size": 140, "seed": 42}'
```

This writes `src/data/generated/python-tda-graph.json`.
