import { pollingStations } from "@/src/data/geo/pollingStations";
import { generateAnomalyAlerts } from "@/src/lib/tda/anomalyAlertEngine";
import type { LiveStation } from "@/src/store/electionStreamStore";
interface StreamEvent { station: LiveStation; alerts: ReturnType<typeof generateAnomalyAlerts>; }
type StreamSubscriber = (event: StreamEvent) => void;
const subscribers = new Set<StreamSubscriber>();
let timer: ReturnType<typeof setTimeout> | null = null;
const stationState = new Map<string, LiveStation>();
const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
const delta = () => Math.random() * 16 - 8;
const computeRiskColor = (station: LiveStation): LiveStation["riskColor"] => { const riskIndex=(station.anomalyScore+station.violenceRisk+station.queuePressure)/3; if(riskIndex>=78)return"red"; if(riskIndex>=60)return"orange"; if(riskIndex>=40)return"yellow"; return"green"; };
function mutateStation(current: LiveStation): LiveStation { const updated:LiveStation={...current,turnout:clamp(current.turnout+delta()),anomalyScore:clamp(current.anomalyScore+delta()),influenceScore:clamp(current.influenceScore+delta()),sentimentScore:clamp(current.sentimentScore+delta()),queuePressure:clamp(current.queuePressure+delta()),violenceRisk:clamp(current.violenceRisk+delta()),ballotVelocity:clamp(current.ballotVelocity+delta()),lastUpdated:new Date().toISOString(),riskColor:current.riskColor}; updated.riskColor=computeRiskColor(updated); return updated; }
function emitTick(){ const base=pollingStations[Math.floor(Math.random()*pollingStations.length)]; const current=stationState.get(base.id); const seeded:LiveStation=current??{...base,turnout:40+Math.round(Math.random()*30),anomalyScore:20+Math.round(Math.random()*30),influenceScore:20+Math.round(Math.random()*30),sentimentScore:30+Math.round(Math.random()*40),queuePressure:20+Math.round(Math.random()*40),violenceRisk:10+Math.round(Math.random()*25),ballotVelocity:30+Math.round(Math.random()*30),riskColor:"green",lastUpdated:new Date().toISOString()}; const station=mutateStation(seeded); stationState.set(station.id,station); const event={station,alerts:generateAnomalyAlerts(station)}; subscribers.forEach((s)=>s(event)); timer=setTimeout(emitTick,2000+Math.floor(Math.random()*3000)); }
export function startElectionStream(){ if(timer)return; emitTick(); }
export function stopElectionStream(){ if(!timer)return; clearTimeout(timer); timer=null; }
export function subscribeToElectionStream(subscriber: StreamSubscriber){ subscribers.add(subscriber); return ()=>subscribers.delete(subscriber); }
