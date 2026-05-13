from __future__ import annotations

from datetime import datetime, UTC
from pathlib import Path
from typing import Any

import kmapper as km
import networkx as nx
import numpy as np
import json
import pandas as pd
from fastapi import FastAPI
from hdbscan import HDBSCAN
from pydantic import BaseModel, Field
from sklearn.preprocessing import StandardScaler
from umap import UMAP

app = FastAPI(title="Tuko Kadi TDA Service", version="0.1.0")

ROOT = Path(__file__).resolve().parents[2]
FRONTEND_GRAPH_PATH = ROOT / "src" / "data" / "generated" / "python-tda-graph.json"


class GraphRequest(BaseModel):
    sample_size: int = Field(default=160, ge=80, le=400)
    seed: int = Field(default=42)


def build_synthetic_matrix(sample_size: int, seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    turnout = np.clip(rng.normal(0.62, 0.15, sample_size), 0.22, 0.98)
    upload_delay = np.clip(rng.gamma(2.1, 15.0, sample_size), 2, 180)
    form_discrepancy = np.clip(rng.beta(1.8, 4.8, sample_size), 0, 1)
    cross_race_variance = np.clip(rng.normal(0.31, 0.18, sample_size), 0, 1)
    recount_pressure = np.clip(rng.normal(0.35, 0.22, sample_size), 0, 1)
    geo_dispersion = np.clip(rng.normal(0.42, 0.19, sample_size), 0, 1)

    anomaly_idx = rng.choice(sample_size, size=max(8, sample_size // 10), replace=False)
    turnout[anomaly_idx] = np.clip(turnout[anomaly_idx] + rng.normal(0.21, 0.09, anomaly_idx.size), 0, 1)
    form_discrepancy[anomaly_idx] = np.clip(form_discrepancy[anomaly_idx] + rng.normal(0.34, 0.12, anomaly_idx.size), 0, 1)
    upload_delay[anomaly_idx] = np.clip(upload_delay[anomaly_idx] + rng.normal(36, 18, anomaly_idx.size), 0, 220)

    return pd.DataFrame(
        {
            "turnout_rate": turnout,
            "upload_delay_minutes": upload_delay,
            "form_discrepancy": form_discrepancy,
            "cross_race_variance": cross_race_variance,
            "recount_pressure": recount_pressure,
            "geo_dispersion": geo_dispersion,
        }
    )


def run_pipeline(df: pd.DataFrame, seed: int) -> dict[str, Any]:
    features = df.values
    scaled = StandardScaler().fit_transform(features)
    reducer = UMAP(n_neighbors=18, min_dist=0.14, n_components=2, metric="euclidean", random_state=seed)
    embedding = reducer.fit_transform(scaled)

    clusterer = HDBSCAN(min_cluster_size=8, min_samples=5, metric="euclidean", prediction_data=True)
    labels = clusterer.fit_predict(embedding)
    probs = clusterer.probabilities_

    mapper = km.KeplerMapper(verbose=0)
    graph = mapper.map(
        lens=embedding,
        X=scaled,
        cover=km.Cover(n_cubes=10, perc_overlap=0.28),
        clusterer=HDBSCAN(min_cluster_size=6, min_samples=4),
    )

    nx_graph = km.adapter.to_nx(graph)
    node_payload: list[dict[str, Any]] = []
    for idx, (node_id, member_ids) in enumerate(graph["nodes"].items()):
        member_array = np.array(member_ids, dtype=int)
        cluster_labels = labels[member_array]
        anomaly_spread = float(np.mean(df.iloc[member_array]["form_discrepancy"]))
        confidence = float(np.mean(probs[member_array]))
        density = float(member_array.size / max(1, len(df)))
        severity = int(np.clip((anomaly_spread * 68 + density * 90 + (1 - confidence) * 25), 15, 99))
        node_payload.append(
            {
                "id": str(node_id),
                "stationId": f"tda-node-{idx:03d}",
                "label": f"TDA Cell {idx + 1}",
                "county": "Synthetic County",
                "ward": f"Ward {idx % 12 + 1}",
                "severity": severity,
                "riskLevel": "critical" if severity >= 85 else "high" if severity >= 70 else "medium" if severity >= 50 else "low",
                "reviewerStatus": "requires_review" if severity >= 80 else "in_review" if severity >= 60 else "unreviewed",
                "primaryIssue": "topological anomaly spread",
                "explanation": "Generated via Python TDA pipeline (UMAP + HDBSCAN + Mapper) for civic observatory analysis.",
                "featureSummary": [
                    f"Cluster labels: {sorted(set(cluster_labels.tolist()))}",
                    f"Density {density:.3f}",
                    f"Confidence {confidence:.3f}",
                    f"Anomaly spread {anomaly_spread:.3f}",
                ],
                "timelineEvents": [{"timestamp": datetime.now(UTC).isoformat(), "label": "TDA graph generated"}],
                "relatedClusterIds": [],
                "affectedStations": int(member_array.size),
                "affectedWards": int(max(1, round(member_array.size / 6))),
                "tda": {"density": density, "confidence": confidence, "anomalySpread": anomaly_spread},
            }
        )

    edges_payload: list[dict[str, Any]] = []
    for idx, (source, target) in enumerate(nx_graph.edges()):
        s_node = next((node for node in node_payload if node["id"] == str(source)), None)
        t_node = next((node for node in node_payload if node["id"] == str(target)), None)
        if not s_node or not t_node:
            continue
        weight = round((s_node["tda"]["density"] + t_node["tda"]["density"]) / 2 + 0.2, 3)
        edges_payload.append(
            {
                "id": f"tda-edge-{idx:03d}",
                "source": str(source),
                "target": str(target),
                "weight": weight,
                "topologyRelationship": "mapper-overlap",
                "metadata": {
                    "meanConfidence": round((s_node["tda"]["confidence"] + t_node["tda"]["confidence"]) / 2, 3),
                    "meanAnomalySpread": round((s_node["tda"]["anomalySpread"] + t_node["tda"]["anomalySpread"]) / 2, 3),
                },
            }
        )

    id_list = [node["id"] for node in node_payload]
    adjacency = {node_id: set() for node_id in id_list}
    for edge in edges_payload:
        adjacency[edge["source"]].add(edge["target"])
        adjacency[edge["target"]].add(edge["source"])
    for node in node_payload:
        node["relatedClusterIds"] = sorted(adjacency[node["id"]])[:7]
        del node["tda"]

    return {
        "generatedAt": datetime.now(UTC).isoformat(),
        "pipeline": {"reduction": "UMAP", "clustering": "HDBSCAN", "mapper": "KeplerMapper", "rows": len(df), "features": list(df.columns)},
        "nodes": node_payload,
        "edges": edges_payload,
        "summary": {
            "nodeCount": len(node_payload),
            "edgeCount": len(edges_payload),
            "connectedComponents": nx.number_connected_components(nx_graph) if node_payload else 0,
            "meanDegree": float(np.mean([degree for _, degree in nx_graph.degree()])) if node_payload else 0,
        },
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "tda-service"}


@app.post("/generate-graph")
def generate_graph(req: GraphRequest) -> dict[str, Any]:
    df = build_synthetic_matrix(req.sample_size, req.seed)
    payload = run_pipeline(df, req.seed)
    FRONTEND_GRAPH_PATH.parent.mkdir(parents=True, exist_ok=True)
    pd.Series(payload).to_json(FRONTEND_GRAPH_PATH, indent=2)
    return {"status": "generated", "path": str(FRONTEND_GRAPH_PATH), "summary": payload["summary"]}


@app.get("/graph-summary")
def graph_summary() -> dict[str, Any]:
    if not FRONTEND_GRAPH_PATH.exists():
        return {"status": "missing", "path": str(FRONTEND_GRAPH_PATH)}
    payload = json.loads(FRONTEND_GRAPH_PATH.read_text())
    return {"status": "ok", "generatedAt": payload.get("generatedAt"), "summary": payload.get("summary")}
