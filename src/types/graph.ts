export type ClusterType = "normal" | "warning" | "anomaly";

export interface ClusterNode {
  id: string;
  label: string;
  type: ClusterType;
  x: number;
  y: number;
  size: number;
  validated?: boolean;
  severity: number;
  confidence: number;
  stations: number;
  wards: number;
  issue: string;
  whyFlagged: string;
  signals: string[];
}

export interface ClusterEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
}
