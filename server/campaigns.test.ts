import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { campaigns, initialCampaignId, readCampaignPartners } from "../client/src/lib/campaigns";
import Home from "../client/src/pages/Home";

const [lessence, orygem] = campaigns;
function storageWith(values: Record<string, string> = {}) {
  return { getItem: (key: string) => values[key] ?? null };
}
function mockWindow(investida: string, values: Record<string, string> = {}) {
  vi.stubGlobal("window", {
    location: { search: `?investida=${investida}` },
    localStorage: storageWith(values),
  });
}
afterEach(() => vi.unstubAllGlobals());

describe("Investidas independentes", () => {
  it("mantém a base da Lessence em 98 e da Orygem em 99, com 34 Elite", () => {
    expect(lessence.target).toBe(98);
    expect(lessence.elite).toBe(34);
    expect(lessence.target - lessence.elite).toBe(64);
    expect(orygem.target).toBe(99);
    expect(orygem.elite).toBe(34);
    expect(orygem.target - orygem.elite).toBe(65);
  });

  it("preserva os 15 parceiros reais, a data e a chave local da Lessence", () => {
    expect(lessence.storageKey).toBe("gestor-parcerias:partners:v12");
    expect(lessence.startedAt).toBe("2026-10-10");
    const partners = readCampaignPartners(lessence, storageWith());
    expect(partners).toHaveLength(15);
    expect(partners[0].name).toBe("Hamilton");
    expect(partners[14].region).toBe("Península");
  });

  it("lê cadastros do navegador existentes, em vez de substituí-los pelos registros iniciais", () => {
    const saved = [{ ...lessence.initialPartners[0], name: "Cadastro existente", notes: "Nota preservada" }];
    const partners = readCampaignPartners(lessence, storageWith({ [lessence.storageKey]: JSON.stringify(saved) }));
    expect(partners).toEqual(saved);
  });

  it("carrega Orygem com os 33 parceiros informados e sem dados da campanha anterior", () => {
    expect(orygem.storageKey).not.toBe(lessence.storageKey);
    expect(orygem.startedAt).toBe("2026-11-07");
    expect(orygem.phaseNote).toBeNull();
    const storage = storageWith({ [lessence.storageKey]: JSON.stringify(lessence.initialPartners) });
    expect(readCampaignPartners(orygem, storage)).toHaveLength(33);
    expect(readCampaignPartners(orygem, storage)[0].name).toBe("Fernando Lacerda");
  });

  it("restaura apenas os registros da chave da Orygem e conserva a Lessence separada", () => {
    const record = { ...lessence.initialPartners[0], name: "Resposta Orygem" };
    const storage = storageWith({
      [lessence.storageKey]: JSON.stringify(lessence.initialPartners),
      [orygem.storageKey]: JSON.stringify([record]),
    });
    expect(readCampaignPartners(orygem, storage).map((item) => item.name)).toEqual(["Resposta Orygem"]);
    expect(readCampaignPartners(lessence, storage)).toHaveLength(15);
    expect(readCampaignPartners(orygem, storageWith({ [orygem.storageKey]: "[]" }))).toEqual([]);
  });

  it("seleciona Orygem pelo link direto e mantém Lessence como padrão para links sem investida válida", () => {
    mockWindow("orygem-cassiano");
    expect(initialCampaignId()).toBe("orygem-cassiano");
    mockWindow("inexistente");
    expect(initialCampaignId()).toBe("pre-venda-lessence");
  });

  it("renderiza a aba Orygem nos mesmos moldes, sem linhas ou dados indevidos da Lessence", () => {
    mockWindow("orygem-cassiano");
    const html = renderToStaticMarkup(createElement(Home));
    expect(html).toContain("<h1>Orygem Cassiano</h1>");
    expect(html).toContain("Pré-venda Lessence");
    expect(html).toContain("07 de novembro de 2026");
    expect(html).not.toContain("Hamilton");
    expect(html).not.toContain("Observação da Fase 1");
    expect(html).toContain("Fernando Lacerda");
    expect(html).toContain("João Pedro");
    expect(html).toContain("Ursula");
    expect(html).toContain("Felipe");
    for (const label of ["Total de parceiros", "Total Elite", "Total Geral", "Total que responderam", "Total interessados", "Sem resposta", "Nome do parceiro", "Categoria", "Comentários", "Como reagiu"]) {
      expect(html).toContain(label);
    }
    expect(html.match(/class="metric-value"/g)).toHaveLength(6);
    expect(html.match(/class="column-sort/g)).toHaveLength(4);
  });

  it("continua renderizando a Lessence com os registros e a observação originais", () => {
    mockWindow("pre-venda-lessence");
    const html = renderToStaticMarkup(createElement(Home));
    expect(html).toContain("<h1>Pré-venda Lessence</h1>");
    expect(html).toContain("Hamilton");
    expect(html).toContain("Observação da Fase 1");
    expect(html).toContain("10 de outubro de 2026");
  });
});
