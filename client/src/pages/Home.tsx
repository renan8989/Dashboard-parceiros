import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleAlert,
  CircleSlash2,
  Clock3,
  ExternalLink,
  Filter,
  LayoutDashboard,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRound,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState, type SetStateAction } from "react";
import { campaigns, initialCampaignId, readCampaignPartners, type CampaignId, type PartnerRecord, type PartnerSegment, type ResponseQuality, type ResponseStatus } from "@/lib/campaigns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



 const qualityLabels: Record<ResponseQuality, string> = {
  positive: "Interessado",
  follow_up: "Acompanhar",
  negative: "Sem interesse",
  none: "Ainda sem retorno",
 };

 const qualityClasses: Record<ResponseQuality, string> = {
  positive: "status-positive",
  follow_up: "status-follow-up",
  negative: "status-negative",
  none: "status-none",
 };


 function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`)).replace(".", "");
 }

 function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
 }

 function initials(name: string) {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
 }

 function labelForStatus(status: ResponseStatus) {
  return status === "responded" ? "Respondeu" : "Sem resposta";
 }

 export default function Home() {
  const [activeCampaignId, setActiveCampaignId] = useState<CampaignId>(initialCampaignId);
  const [partnersByCampaign, setPartnersByCampaign] = useState<Record<CampaignId, PartnerRecord[]>>(() => {
    let storage: Storage | undefined;
    try { storage = typeof window !== "undefined" ? window.localStorage : undefined; } catch { /* Browser storage may be unavailable. */ }
    return Object.fromEntries(campaigns.map((item) => [item.id, readCampaignPartners(item, storage)])) as Record<CampaignId, PartnerRecord[]>;
  });
  const campaign = campaigns.find((item) => item.id === activeCampaignId)!;
  const partners = partnersByCampaign[activeCampaignId];
  const setPartners = (update: SetStateAction<PartnerRecord[]>) => {
    setPartnersByCampaign((current) => ({
      ...current,
      [activeCampaignId]: typeof update === "function" ? update(current[activeCampaignId]) : update,
    }));
  };
  const [query, setQuery] = useState("");
  const [reactionOrder, setReactionOrder] = useState<"normal" | "positive">("normal");
  const [sort, setSort] = useState<"date" | "name" | "reaction" | "segment">("date");
  const [nameOrder, setNameOrder] = useState<"asc" | "desc">("asc");
  const [dateOrder, setDateOrder] = useState<"asc" | "desc">("asc");
  const [segmentOrder, setSegmentOrder] = useState<"elite" | "general">("elite");
  const [selected, setSelected] = useState<PartnerRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerRecord | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      campaigns.forEach((item) => window.localStorage.setItem(item.storageKey, JSON.stringify(partnersByCampaign[item.id])));
    } catch {
      setToast("Não foi possível salvar no navegador. Mantenha esta aba aberta.");
    }
  }, [partnersByCampaign]);

  const selectCampaign = (id: CampaignId) => {
    setActiveCampaignId(id);
    setQuery("");
    setSelected(null);
    setEditing(null);
    setFormOpen(false);
    setToast("");
    const url = new URL(window.location.href);
    url.searchParams.set("investida", id);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => ({
    total: campaign.target,
    elite: campaign.elite,
    general: campaign.target - campaign.elite,
    eliteResponded: partners.filter((partner) => partner.segment === "elite").length,
    generalResponded: partners.filter((partner) => partner.segment === "general").length,
    responded: partners.length,
    noResponse: Math.max(0, campaign.target - partners.length),
    positive: partners.filter((partner) => partner.responseQuality === "positive").length,
    normal: partners.filter((partner) => partner.responseQuality !== "positive").length,
  }), [campaign, partners]);

  const filteredPartners = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return partners
      .filter((partner) => {
        const matchesQuery = !normalized || `${partner.name} ${partner.region} ${partner.phone}`.toLowerCase().includes(normalized);
        return matchesQuery;
      })
      .sort((a, b) => {
        const aIsPositive = a.responseQuality === "positive";
        const bIsPositive = b.responseQuality === "positive";
        if (sort === "reaction" && aIsPositive !== bIsPositive) {
          return reactionOrder === "normal" ? (aIsPositive ? 1 : -1) : (aIsPositive ? -1 : 1);
        }
        if (sort === "segment" && a.segment !== b.segment) {
          return segmentOrder === "elite" ? (a.segment === "elite" ? -1 : 1) : (a.segment === "general" ? -1 : 1);
        }
        if (sort === "name") {
          const result = a.name.localeCompare(b.name, "pt-BR");
          return nameOrder === "asc" ? result : -result;
        }
        if (sort === "date") {
          const result = a.contactedAt.localeCompare(b.contactedAt);
          return dateOrder === "asc" ? result : -result;
        }
        return 0;
      });
  }, [dateOrder, nameOrder, partners, query, reactionOrder, segmentOrder, sort]);

  const openNewForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (partner: PartnerRecord) => {
    setSelected(null);
    setEditing(partner);
    setFormOpen(true);
  };

  const savePartner = (draft: Omit<PartnerRecord, "id" | "history">) => {
    if (editing) {
      setPartners((current) => current.map((partner) => partner.id === editing.id ? { ...partner, ...draft } : partner));
      setToast("Parceiro atualizado na investida.");
    } else {
      const next: PartnerRecord = { ...draft, id: Date.now(), history: [{ date: draft.contactedAt, kind: "message", detail: "Primeiro contato registrado na dashboard." }] };
      setPartners((current) => [next, ...current]);
      setToast("Parceiro adicionado à investida.");
    }
    setFormOpen(false);
    setEditing(null);
  };

  const addHistory = (partnerId: number, detail: string) => {
    if (!detail.trim()) return;
    const item = { date: new Date().toISOString().slice(0, 10), kind: "note" as const, detail: detail.trim() };
    setPartners((current) => current.map((partner) => partner.id === partnerId ? { ...partner, history: [item, ...partner.history] } : partner));
    setSelected((current) => current && current.id === partnerId ? { ...current, history: [item, ...current.history] } : current);
    setToast("Acompanhamento registrado.");
  };

  const title = campaign.name;
  const responseRate = stats.total ? Math.round((stats.responded / stats.total) * 100) : 0;
  const positiveRate = stats.responded ? Math.round((stats.positive / stats.responded) * 100) : 0;
  const eliteRate = stats.elite ? Math.round((stats.eliteResponded / stats.elite) * 100) : 0;
  const generalRate = stats.general ? Math.round((stats.generalResponded / stats.general) * 100) : 0;
  const noResponseRate = stats.total ? Math.round((stats.noResponse / stats.total) * 100) : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Target size={17} strokeWidth={2.5} /></div>
          <div><div className="brand-name">Ponto de parceria</div><div className="brand-caption">controle de investidas</div></div>
        </div>
        <div className="sidebar-section-label">Investidas</div>
        <nav className="nav-list" aria-label="Navegação principal">
          {campaigns.map((item) => (
            <button key={item.id} className={`nav-item ${activeCampaignId === item.id ? "is-active" : ""}`} onClick={() => selectCampaign(item.id)} aria-current={activeCampaignId === item.id ? "page" : undefined}>
              <LayoutDashboard size={17} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <button className="add-campaign"><Plus size={15} /> Nova investida</button>
        <div className="sidebar-footer"><div className="sidebar-tip"><Sparkles size={16} /><div><strong>Próxima ação</strong><span>{stats.noResponse} contatos sem retorno precisam de follow-up.</span></div></div><div className="profile-row"><div className="avatar avatar-dark">GP</div><div><strong>Gestor de parcerias</strong><span>Operação comercial</span></div><MoreHorizontal size={16} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><nav className="campaign-tabs" aria-label="Abas das investidas">
          {campaigns.map((item) => (
            <button key={item.id} className={`campaign-tab ${activeCampaignId === item.id ? "is-active" : ""}`} onClick={() => selectCampaign(item.id)} aria-current={activeCampaignId === item.id ? "page" : undefined}>
              {item.name}
            </button>
          ))}
        </nav></header>

        <div className="page-wrap">
          <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> Investida ativa <span className="eyebrow-date">{campaign.startedAt ? `Iniciada em ${formatLongDate(campaign.startedAt)}` : "Data de início não informada"}</span></div><h1>{title}</h1><p className="subtitle">Registre somente quem respondeu ao contato e acompanhe a qualidade de cada reação.</p></div><div className="heading-actions"><button className="secondary-button"><ExternalLink size={15} /> Exportar</button><Button onClick={openNewForm}><Plus size={16} /> Registrar resposta</Button></div></section>

          <section className="metrics-stack" aria-label="Resumo da investida">
            <div className="metrics-row metrics-row-primary">
              <div className="metric-card metric-dark"><div className="metric-top"><span>Total de parceiros</span><Users size={17} /></div><div className="metric-value">{stats.total}</div><div className="metric-bottom"><span className="metric-trend"><ArrowUpRight size={13} /> base da investida</span><span>100% cadastrados</span></div><div className="progress-track"><div className="progress-fill progress-mint" style={{ width: "100%" }} /></div></div>
              <div className="metric-card metric-elite"><div className="metric-top"><span>Total Elite</span><Target size={17} /></div><div className="metric-value">{stats.elite}</div><div className="metric-bottom"><span className="metric-trend metric-trend-green"><MessageCircle size={13} /> {stats.eliteResponded} responderam</span><span>{eliteRate}%</span></div><div className="mini-bars"><span style={{ height: "32%" }} /><span style={{ height: "47%" }} /><span style={{ height: "38%" }} /><span style={{ height: "61%" }} /><span style={{ height: "56%" }} /><span className="bar-active" style={{ height: `${Math.max(16, eliteRate)}%` }} /></div></div>
              <div className="metric-card metric-general"><div className="metric-top"><span>Total Geral</span><UserRound size={17} /></div><div className="metric-value">{stats.general}</div><div className="metric-bottom"><span className="metric-trend metric-trend-green"><MessageCircle size={13} /> {stats.generalResponded} responderam</span><span>{generalRate}%</span></div><div className="mini-bars"><span style={{ height: "32%" }} /><span style={{ height: "44%" }} /><span style={{ height: "38%" }} /><span style={{ height: "51%" }} /><span style={{ height: "46%" }} /><span className="bar-active" style={{ height: `${Math.max(16, generalRate)}%` }} /></div></div>
            </div>
            <div className="metrics-row metrics-row-secondary">
              <div className="metric-card metric-responded"><div className="metric-top"><span>Total que responderam</span><MessageCircle size={17} /></div><div className="metric-value">{stats.responded}</div><div className="metric-bottom"><span className="metric-trend metric-trend-green"><ArrowUpRight size={13} /> {responseRate}% da base</span><span>de {stats.total}</span></div><div className="mini-bars"><span style={{ height: "32%" }} /><span style={{ height: "44%" }} /><span style={{ height: "38%" }} /><span style={{ height: "61%" }} /><span style={{ height: "56%" }} /><span className="bar-active" style={{ height: `${Math.max(16, responseRate)}%` }} /></div></div>
              <div className="metric-card metric-positive"><div className="metric-top"><span>Total interessados</span><Sparkles size={17} /></div><div className="metric-value">{stats.positive}</div><div className="metric-bottom"><span className="metric-trend metric-trend-coral"><ArrowUpRight size={13} /> {positiveRate}% dos retornos</span><span>prioridade alta</span></div><div className="interest-dots"><span className="interest-dot active" /><span className="interest-dot active" /><span className="interest-dot active" /><span className="interest-dot active" /><span className="interest-dot" /><span className="interest-dot" /><span className="interest-dot" /></div></div>
              <div className="metric-card"><div className="metric-top"><span>Sem resposta</span><CircleAlert size={17} /></div><div className="metric-value">{stats.noResponse}</div><div className="metric-bottom"><span className="metric-trend metric-trend-amber"><Clock3 size={13} /> {noResponseRate}% da base</span><span>próxima ação</span></div><div className="followup-line"><span className="followup-avatar">{stats.noResponse}</span><span>contatos aguardando follow-up</span></div></div>
            </div>
          </section>

            {campaign.phaseNote && <div className="phase-note-strip"><Sparkles size={15} /><span><strong>Observação da Fase 1:</strong> {campaign.phaseNote}</span></div>}
            <section className="insight-strip"><div className="insight-icon"><Sparkles size={18} /></div><div><strong>Registre cada resposta assim que ela chegar.</strong><span>Use “Interessado” para destacar os parceiros que merecem prioridade na próxima conversa.</span></div><button onClick={openNewForm} className="insight-link">Registrar resposta <ArrowUpRight size={14} /></button></section>

          <section className="list-section"><div className="list-heading"><div><div className="section-kicker"><Activity size={14} /> Respostas registradas</div><h2>Parceiros que responderam</h2></div><div className="list-meta"><span className="demo-pill"><span /> Dados da operação</span><span>{filteredPartners.length} exibidos</span></div></div>
            <div className="toolbar"><div className="search-wrap"><Search size={16} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar parceiro" /></div><span className="sort-hint"><ChevronsUpDown size={14} /> Clique nas setas para ordenar e agrupar</span></div>
            <div className="partner-table-wrap"><table className="partner-table"><thead><tr><th><button className="column-sort" onClick={() => { setSort("name"); setNameOrder((current) => current === "asc" ? "desc" : "asc"); }} aria-label={`Ordenar nome ${nameOrder === "asc" ? "de A a Z" : "de Z a A"}`}>Nome do parceiro <ChevronsUpDown size={13} /></button></th><th><button className={`column-sort reaction-sort-${segmentOrder}`} onClick={() => { setSort("segment"); setSegmentOrder(segmentOrder === "elite" ? "general" : "elite"); }} aria-label={`Agrupar ${segmentOrder === "elite" ? "Geral" : "Elite"} primeiro`}>Categoria <ChevronsUpDown size={13} /></button></th><th><span className="column-label">Comentários</span></th><th><button className={`column-sort reaction-sort-${reactionOrder}`} onClick={() => { setSort("reaction"); setReactionOrder(reactionOrder === "normal" ? "positive" : "normal"); }} aria-label={`Agrupar ${reactionOrder === "normal" ? "interessados" : "normais"} primeiro`}>Como reagiu <ChevronsUpDown size={13} /></button></th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{filteredPartners.map((partner) => <tr key={partner.id} className={partner.responseQuality === "positive" ? "is-positive-row" : ""} onClick={() => setSelected(partner)}><td><div className="partner-cell"><div><strong>{partner.name}</strong><span>{partner.region || "Região não informada"}</span></div></div></td><td><span className={`segment-tag segment-${partner.segment}`}>{partner.segment === "elite" ? "Elite" : "Geral"}</span></td><td><span className="comment-cell">{partner.notes || "—"}</span></td><td><span className={`quality-label ${partner.responseQuality === "positive" ? "status-positive" : "status-follow-up"}`}>{partner.responseQuality === "positive" && <Sparkles size={13} />}{partner.responseQuality === "positive" ? "Interessado" : "Normal"}</span></td><td><button className="row-more" onClick={(event) => { event.stopPropagation(); setSelected(partner); }} aria-label={`Abrir ${partner.name}`}><ChevronRight size={16} /></button></td></tr>)}</tbody></table>{filteredPartners.length === 0 && <div className="empty-state"><Search size={23} /><strong>{partners.length ? "Nenhuma resposta encontrada" : "Nenhuma resposta registrada nesta investida"}</strong><span>{partners.length ? "Tente buscar por outro termo." : "Clique em Registrar resposta para adicionar o primeiro parceiro que respondeu."}</span></div>}</div>
            <div className="table-footer"><span>Mostrando {filteredPartners.length} de {partners.length} respostas cadastradas</span><span className="table-limit">Base da investida: {campaign.target} parceiros <Target size={13} /></span></div>
          </section>
        </div>
      </main>

      {selected && <PartnerDetail partner={selected} onClose={() => setSelected(null)} onEdit={() => openEditForm(selected)} onAddHistory={addHistory} />}
      {formOpen && <PartnerForm initial={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={savePartner} />}
      {toast && <div className="toast"><Check size={15} /> {toast}</div>}
    </div>
  );
 }

 function PartnerDetail({ partner, onClose, onEdit, onAddHistory }: { partner: PartnerRecord; onClose: () => void; onEdit: () => void; onAddHistory: (partnerId: number, detail: string) => void }) {
  const [note, setNote] = useState("");
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="detail-drawer"><div className="drawer-header"><div><span className="eyebrow drawer-eyebrow">Ficha do parceiro</span><h2>{partner.name}</h2><p>{partner.region}</p></div><button className="close-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div><div className="drawer-body"><div className="detail-hero"><div><span className={`status-pill ${partner.responseStatus === "responded" ? "status-responded" : "status-waiting"}`}><span /> {labelForStatus(partner.responseStatus)}</span><div className={`quality-label ${qualityClasses[partner.responseQuality]}`}>{partner.responseQuality === "positive" && <Sparkles size={13} />}{qualityLabels[partner.responseQuality]}</div></div></div><div className="detail-contact">{partner.phone ? <a href={`https://wa.me/55${partner.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Abrir no WhatsApp <ExternalLink size={13} /></a> : <span><MessageCircle size={15} /> WhatsApp ainda não informado</span>}<span><Phone size={14} /> {partner.phone || "Telefone ainda não informado"}</span><span><CalendarDays size={14} /> Resposta em {formatLongDate(partner.contactedAt)}</span></div>{partner.notes && <div className="note-card"><span>Observação</span><p>{partner.notes}</p></div>}<div className="timeline-heading"><span>Histórico de acompanhamento</span><span>{partner.history.length} registros</span></div><div className="timeline">{partner.history.map((item, index) => <div className="timeline-item" key={`${item.date}-${index}`}><div className="timeline-dot">{item.kind === "message" ? <MessageCircle size={12} /> : item.kind === "call" ? <Phone size={12} /> : <Pencil size={12} />}</div><div><div className="timeline-meta"><span>{formatLongDate(item.date)}</span><span>{item.kind === "message" ? "WhatsApp" : item.kind === "call" ? "Ligação" : "Nota"}</span></div><p>{item.detail}</p></div></div>)}</div><div className="add-note"><Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Registrar próximo passo..." rows={3} /><Button size="sm" onClick={() => { onAddHistory(partner.id, note); setNote(""); }}>Salvar registro <ArrowUpRight size={14} /></Button></div></div><div className="drawer-footer"><Button variant="outline" onClick={onEdit}><Pencil size={15} /> Editar parceiro</Button><Button variant="ghost" size="icon" aria-label="Mais opções"><MoreHorizontal size={18} /></Button></div></aside></div>;
 }

 function PartnerForm({ initial, onClose, onSave }: { initial: PartnerRecord | null; onClose: () => void; onSave: (draft: Omit<PartnerRecord, "id" | "history">) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [region, setCompany] = useState(initial?.region ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [contactedAt, setContactedAt] = useState(initial?.contactedAt ?? new Date().toISOString().slice(0, 10));
  const [segment, setSegment] = useState<PartnerSegment>(initial?.segment ?? "elite");
  const [responseQuality, setResponseQuality] = useState<ResponseQuality>(initial?.responseQuality ?? "none");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const canSave = name.trim().length > 1;
  return <div className="modal-backdrop form-backdrop"><div className="form-modal"><div className="form-header"><div><span className="eyebrow">{initial ? "Atualizar cadastro" : "Nova pessoa na rede"}</span><h2>{initial ? "Editar parceiro" : "Adicionar parceiro"}</h2><p>Cadastre somente quem respondeu à mensagem.</p></div><button className="close-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div><div className="form-grid"><label>Nome completo<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Marina Costa" /></label><label>Região de atuação<Input value={region} onChange={(event) => setCompany(event.target.value)} placeholder="Ex.: Barra/Recreio" /></label><label>WhatsApp Business<Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(11) 99999-9999" /></label><label>Data da resposta<Input type="date" value={contactedAt} onChange={(event) => setContactedAt(event.target.value)} /></label><label>Categoria<select value={segment} onChange={(event) => setSegment(event.target.value as PartnerSegment)}><option value="elite">Elite</option><option value="general">Geral</option></select></label><label>Como reagiu?<select value={responseQuality === "positive" ? "positive" : "normal"} onChange={(event) => setResponseQuality(event.target.value === "positive" ? "positive" : "follow_up")}><option value="normal">Normal</option><option value="positive">Interessado</option></select></label><label className="full-field">Observações<Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Registre o que a pessoa respondeu e o próximo passo..." rows={4} /></label></div><div className="form-footer"><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button disabled={!canSave} onClick={() => onSave({ name: name.trim(), region: region.trim(), phone: phone.trim(), contactedAt, responseStatus: "responded", responseQuality, segment, notes: notes.trim() })}>{initial ? "Salvar alterações" : "Adicionar resposta"}</Button></div></div></div>;
 }
