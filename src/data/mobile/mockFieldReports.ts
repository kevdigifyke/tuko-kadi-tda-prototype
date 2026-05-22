export type IncidentCategory =
  | "violence"
  | "intimidation"
  | "delayed opening"
  | "ballot shortages"
  | "network disruption"
  | "suspicious turnout spikes";
export type SeverityLevel = "critical" | "high" | "moderate" | "low";
export type ReportStatus = "new" | "verifying" | "escalated" | "resolved";
export interface ObserverStatus { id: string; name: string; county: string; constituency: string; status: "active" | "inactive"; lastCheckIn: string; }
export interface FieldReport {
  id: string; observerId: string; observerName: string; pollingStation: string; county: string; constituency: string; ward: string;
  category: IncidentCategory; severity: SeverityLevel; status: ReportStatus; timestamp: string;
  coordinates: { lat: number; lng: number }; turnoutPct: number; summary: string; mediaCount: number;
}
export const mockFieldReports: FieldReport[] = [
  { id: "RPT-KE-001", observerId: "OBS-110", observerName: "Amina Njeri", pollingStation: "Mathare North Primary Stream 03", county: "Nairobi", constituency: "Ruaraka", ward: "Mathare North", category: "intimidation", severity: "high", status: "escalated", timestamp: "2026-05-22T05:34:00+03:00", coordinates: { lat: -1.2532, lng: 36.8723 }, turnoutPct: 54, summary: "Group of unidentified youths seen directing queues and challenging voter IDs.", mediaCount: 2 },
  { id: "RPT-KE-002", observerId: "OBS-084", observerName: "Daniel Ouma", pollingStation: "Migori TTC Hall Stream 01", county: "Migori", constituency: "Suna East", ward: "Central Kanyarwanda", category: "ballot shortages", severity: "critical", status: "verifying", timestamp: "2026-05-22T06:02:00+03:00", coordinates: { lat: -1.0714, lng: 34.4743 }, turnoutPct: 68, summary: "Presidential ballot booklets depleted before noon, replacement requested from RO.", mediaCount: 1 },
  { id: "RPT-KE-003", observerId: "OBS-207", observerName: "Beatrice Kibet", pollingStation: "Kapseret D.E.B. Stream 02", county: "Uasin Gishu", constituency: "Kapseret", ward: "Langas", category: "network disruption", severity: "moderate", status: "new", timestamp: "2026-05-22T06:25:00+03:00", coordinates: { lat: 0.4889, lng: 35.2787 }, turnoutPct: 47, summary: "KIEMS kit transmitted intermittently; queue progression slowed significantly.", mediaCount: 0 },
  { id: "RPT-KE-004", observerId: "OBS-052", observerName: "Moses Mwangangi", pollingStation: "Mwala Chiefs Camp Stream 01", county: "Machakos", constituency: "Mwala", ward: "Mbiuni", category: "delayed opening", severity: "high", status: "resolved", timestamp: "2026-05-22T04:58:00+03:00", coordinates: { lat: -1.2943, lng: 37.4435 }, turnoutPct: 39, summary: "Station opened 95 minutes late due to missing Form 32A seals.", mediaCount: 3 },
  { id: "RPT-KE-005", observerId: "OBS-331", observerName: "Fatma Ali", pollingStation: "Mvita Social Hall Stream 04", county: "Mombasa", constituency: "Mvita", ward: "Majengo", category: "suspicious turnout spikes", severity: "critical", status: "new", timestamp: "2026-05-22T06:41:00+03:00", coordinates: { lat: -4.0481, lng: 39.6672 }, turnoutPct: 92, summary: "Turnout jumped from 33% to 92% in under one hour without corresponding queue volume.", mediaCount: 2 },
  { id: "RPT-KE-006", observerId: "OBS-145", observerName: "Peter Kiptoo", pollingStation: "Kipkabus Primary Stream 02", county: "Elgeyo-Marakwet", constituency: "Keiyo South", ward: "Soy South", category: "violence", severity: "critical", status: "escalated", timestamp: "2026-05-22T06:48:00+03:00", coordinates: { lat: 0.2965, lng: 35.4486 }, turnoutPct: 58, summary: "Physical altercation between party agents disrupted operations for 20 minutes.", mediaCount: 4 },
];
export const mockObservers: ObserverStatus[] = [
  { id: "OBS-110", name: "Amina Njeri", county: "Nairobi", constituency: "Ruaraka", status: "active", lastCheckIn: "2026-05-22T06:45:00+03:00" },
  { id: "OBS-084", name: "Daniel Ouma", county: "Migori", constituency: "Suna East", status: "active", lastCheckIn: "2026-05-22T06:40:00+03:00" },
  { id: "OBS-207", name: "Beatrice Kibet", county: "Uasin Gishu", constituency: "Kapseret", status: "inactive", lastCheckIn: "2026-05-22T05:19:00+03:00" },
  { id: "OBS-052", name: "Moses Mwangangi", county: "Machakos", constituency: "Mwala", status: "active", lastCheckIn: "2026-05-22T06:30:00+03:00" },
  { id: "OBS-331", name: "Fatma Ali", county: "Mombasa", constituency: "Mvita", status: "active", lastCheckIn: "2026-05-22T06:43:00+03:00" },
  { id: "OBS-145", name: "Peter Kiptoo", county: "Elgeyo-Marakwet", constituency: "Keiyo South", status: "inactive", lastCheckIn: "2026-05-22T05:02:00+03:00" },
];
export const regionalCoverageGaps = ["Turkana Central", "Mandera East", "Tana River North"];
