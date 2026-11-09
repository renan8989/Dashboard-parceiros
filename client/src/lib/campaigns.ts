export type ResponseStatus = "responded" | "no_response";
export type ResponseQuality = "positive" | "follow_up" | "negative" | "none";
export type PartnerSegment = "elite" | "general";

export type PartnerRecord = {
  id: number;
  name: string;
  segment: PartnerSegment;
  region: string;
  phone: string;
  contactedAt: string;
  responseStatus: ResponseStatus;
  responseQuality: ResponseQuality;
  notes: string;
  history: { date: string; kind: "message" | "call" | "note"; detail: string }[];
 };

const lessencePartners: PartnerRecord[] = [
  { id: 1, name: 'Hamilton', segment: "elite", region: "Muriqui", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 2, name: 'Fernando Lacerda', segment: "elite", region: "Geral", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 3, name: 'Thiago Jacques', segment: "elite", region: "Barra", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Respondeu de forma normal ao contato.' }] },
  { id: 4, name: 'Thiago Soares', segment: "elite", region: "Pontões/Barra Sul", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 5, name: 'Emanuel', segment: "elite", region: "Ipanema/Leblon", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: 'Tem parceiros que gostam de comprar lotes.', history: [{ date: "2026-10-11", kind: "message", detail: 'Tem parceiros que gostam de comprar lotes.' }] },
  { id: 6, name: 'João CW', segment: "elite", region: "Golf", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Respondeu de forma normal ao contato.' }] },
  { id: 7, name: 'Geovana', segment: "elite", region: "Barra", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Respondeu de forma normal ao contato.' }] },
  { id: 8, name: 'Leonardo', segment: "elite", region: "Barra/Recreio", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 9, name: 'Karol', segment: "elite", region: "Geral", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 10, name: 'Aline', segment: "elite", region: "Campo Grande", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 11, name: 'Rafael', segment: "elite", region: "Barra", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: 'Respondeu bem, mas não trabalha em Vargem.', history: [{ date: "2026-10-11", kind: "message", detail: 'Respondeu bem, mas não trabalha em Vargem.' }] },
  { id: 12, name: 'Rafael Blue', segment: "elite", region: "Blue Houses", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Respondeu de forma normal ao contato.' }] },
  { id: 13, name: 'Monica', segment: "elite", region: "Barra", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Respondeu de forma normal ao contato.' }] },
  { id: 14, name: 'Suely', segment: "elite", region: "Geral", phone: "", contactedAt: "2026-10-11", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-10-11", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 15, name: 'Rafael Sr sra', segment: "elite", region: "Península", phone: "", contactedAt: "2026-10-13", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-10-13", kind: "message", detail: 'Respondeu de forma normal ao contato.' }] },
 ];


const orygemPartners: PartnerRecord[] = [
  { id: 101, name: 'Fernando Lacerda', segment: "general", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 102, name: 'Isabel Simões', segment: "general", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 103, name: 'Rogério', segment: "general", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: 'Trouxe cliente que desistiu.', history: [{ date: "2026-11-07", kind: "message", detail: 'Trouxe cliente que desistiu.' }] },
  { id: 104, name: 'Augusto', segment: "elite", region: 'Golf', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 105, name: 'João Pazze', segment: "general", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 106, name: 'Ana', segment: "general", region: 'Barra', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 107, name: 'Roberto', segment: "elite", region: 'Barra', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: 'Falou que o preço está salgado.', history: [{ date: "2026-11-07", kind: "message", detail: 'Falou que o preço está salgado.' }] },
  { id: 108, name: 'Andrea', segment: "general", region: 'Recreio', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 109, name: 'Rn', segment: "general", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 110, name: 'Fernando', segment: "general", region: 'Barra', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 111, name: 'Priscila', segment: "general", region: 'Blue', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 112, name: 'André', segment: "general", region: 'Olímpica', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 113, name: 'Deborah', segment: "elite", region: 'Campo Grande', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 114, name: 'Suely', segment: "elite", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 115, name: 'José Carlos', segment: "general", region: 'Olímpica', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 116, name: 'Renata', segment: "general", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 117, name: 'Simone', segment: "general", region: 'Olímpica', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 118, name: 'Ravini', segment: "general", region: 'Península', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 119, name: 'Nicolas', segment: "general", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 120, name: 'Jaque', segment: "general", region: 'Olímpica', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 121, name: 'Monica', segment: "elite", region: 'Barra', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 122, name: 'Rodrigo', segment: "elite", region: 'Centro', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 123, name: 'Thiago Soares', segment: "elite", region: 'Pontões', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 124, name: 'Aline', segment: "elite", region: 'Campo Grande', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "positive", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Demonstrou interesse na oportunidade.' }] },
  { id: 125, name: 'Karol', segment: "general", region: 'Olímpica', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 126, name: 'João', segment: "elite", region: 'Golf', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 127, name: 'Rafael', segment: "elite", region: 'Blue', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 128, name: 'Rafael Blue', segment: "elite", region: 'Barra', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 129, name: 'Geovana', segment: "elite", region: 'Barra', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
  { id: 130, name: 'Marcelo', segment: "elite", region: 'Geral', phone: "", contactedAt: "2026-11-07", responseStatus: "responded", responseQuality: "follow_up", notes: '', history: [{ date: "2026-11-07", kind: "message", detail: 'Respondeu ao contato.' }] },
];

export type CampaignId = "pre-venda-lessence" | "orygem-cassiano";

export type Campaign = {
  id: CampaignId;
  name: string;
  startedAt: string | null;
  target: number;
  elite: number;
  phaseNote: string | null;
  storageKey: string;
  initialPartners: PartnerRecord[];
};

export const campaigns: Campaign[] = [
  {
    id: "pre-venda-lessence",
    name: "Pré-venda Lessence",
    startedAt: "2026-10-10",
    target: 98,
    elite: 34,
    phaseNote: "o envio foi feito somente para os parceiros Elite.",
    storageKey: "gestor-parcerias:partners:v12",
    initialPartners: lessencePartners,
  },
  {
    id: "orygem-cassiano",
    name: "Orygem Cassiano",
    startedAt: "2026-11-07",
    target: 98,
    elite: 34,
    phaseNote: null,
    storageKey: "gestor-parcerias:partners:orygem-cassiano:v2",
    initialPartners: orygemPartners,
  },
];

export function readCampaignPartners(campaign: Campaign, storage?: Pick<Storage, "getItem">): PartnerRecord[] {
  try {
    const saved = storage?.getItem(campaign.storageKey);
    const source = saved ? JSON.parse(saved) as PartnerRecord[] : campaign.initialPartners;
    if (!Array.isArray(source)) return campaign.initialPartners;
    return source.map((partner) => ({
      ...partner,
      region: campaign.id === "pre-venda-lessence" && partner.id === 15 && !partner.region
        ? "Península" : partner.region,
      segment: partner.segment ?? "elite",
    })).filter((partner) => partner.responseStatus === "responded");
  } catch {
    return campaign.initialPartners;
  }
}

export function initialCampaignId(): CampaignId {
  if (typeof window === "undefined") return "pre-venda-lessence";
  const requested = new URLSearchParams(window.location.search).get("investida");
  return campaigns.find((campaign) => campaign.id === requested)?.id ?? "pre-venda-lessence";
}
