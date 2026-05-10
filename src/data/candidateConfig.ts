import type { Candidate, Party } from "@/src/types/election";

export const parties: Party[] = [
  { id: "upf", name: "Unity Progress Front", short: "UPF", color: "#00B5D8" },
  { id: "nmc", name: "New Mwananchi Congress", short: "NMC", color: "#7C3AED" },
  { id: "rma", name: "Rising Mountain Alliance", short: "RMA", color: "#F59E0B" },
  { id: "ind", name: "Independent", short: "IND", color: "#16A34A" },
];

export const candidates: Candidate[] = [
  { id: "pres-upf", name: "Amina Wanjiru", partyId: "upf", race: "presidential" },
  { id: "pres-nmc", name: "Daniel Otieno", partyId: "nmc", race: "presidential" },
  { id: "pres-rma", name: "Moses Kiptoo", partyId: "rma", race: "presidential" },
  { id: "pres-ind", name: "Grace Naliaka", partyId: "ind", race: "presidential" },
];
