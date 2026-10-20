import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createPartner, createTouchpoint, ensureFirstCampaign, listCampaigns, listPartners, listTouchpoints, updatePartner } from "./db";
import { z } from "zod";

const partnerInput = z.object({
  campaignId: z.number().int().positive(),
  name: z.string().min(2).max(160),
  company: z.string().max(160).optional().nullable(),
  phone: z.string().min(8).max(32),
  contactedAt: z.string().min(8).max(10),
  responseStatus: z.enum(["responded", "no_response"]),
  responseQuality: z.enum(["positive", "follow_up", "negative", "none"]),
  notes: z.string().max(2000).optional().nullable(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  partnerships: router({
    listCampaigns: publicProcedure.query(() => listCampaigns()),
    listPartners: publicProcedure.input(z.object({ campaignId: z.number().int().positive() })).query(({ input }) => listPartners(input.campaignId)),
    listTouchpoints: publicProcedure.input(z.object({ partnerId: z.number().int().positive() })).query(({ input }) => listTouchpoints(input.partnerId)),
    createPartner: publicProcedure.input(partnerInput).mutation(({ input }) => createPartner({ ...input, contactedAt: new Date(input.contactedAt) })),
    updatePartner: publicProcedure.input(z.object({ id: z.number().int().positive(), data: partnerInput.partial().omit({ campaignId: true }) })).mutation(({ input }) => {
      const { contactedAt, ...rest } = input.data;
      return updatePartner(input.id, contactedAt ? { ...rest, contactedAt: new Date(contactedAt) } : rest);
    }),
    addTouchpoint: publicProcedure.input(z.object({ partnerId: z.number().int().positive(), kind: z.enum(["message", "call", "note"]), detail: z.string().min(2).max(2000) })).mutation(({ input }) => createTouchpoint(input)),
    ensureCampaign: publicProcedure.mutation(() => ensureFirstCampaign()),
  }),
});

export type AppRouter = typeof appRouter;
