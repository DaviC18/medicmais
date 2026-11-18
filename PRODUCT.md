# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: families and parents in Barra Mansa and the region (Ano Bom neighborhood), booking dental care for themselves and their children. Most arrive on mobile from Instagram (@medicmaisbarramansa) and Google Maps. Secondary: adults in general who need check-ups, prosthetics or implants.

## Product Purpose
Single-page landing for the dental service (Odontologia) of MedicMais Barra Mansa. One conversion goal: start a conversation on WhatsApp to book an appointment. Success = WhatsApp CTA clicks (tracked as `whatsapp_click` in the GTM dataLayer).

## Positioning
- Multi-specialty clinic: medical, dental and exams under one roof at one address in Ano Bom, so a family can solve its care in one place.
- Humanized care: the clinic cares for people, not only oral health; welcome, respect, empathy, personalized and responsible care by licensed professionals.
- Comfortable environment: a pleasant, comfortable, well-kept space built for comfort, safety and ethics (confirmed by patient reviews).

## Operating Context
Visitors come from Instagram and Google Maps on phones, often deciding quickly whether to message. Booking happens entirely in WhatsApp with a prefilled message; phone call is the secondary channel. The page sits alongside the existing clinic site (medicmaisbarramansa.com.br/odonto) and Instagram.

## Capabilities and Constraints
- Confirmed services: general dentistry (evaluations, guidance, follow-up); prevention and diagnosis; dental prostheses (after professional evaluation); dental implants (after clinical evaluation).
- Brazilian dental advertising rules (CFO): always show the technical lead's name and CRO; no result promises; no prices or promotions; no "the best/the only"; no before/after photos without documented authorization.
- All content comes from `src/data/clinica.ts` (source of truth: `docs/CONTENT.md`).
- Undecided / pending: opening hours, full list of dental specialties, other dentists (name, CRO, photo), clinic photos, real Google reviews, accepted insurance plans, final domain. Use `TODO(conteudo)` placeholders until provided.

## Brand Commitments
- Name: MedicMais Barra Mansa. Slogan: "Nós cuidamos de você e da sua família".
- Logo: "MedicMais" wordmark with a red heart and dark (navy) text (`public/medic+logo.png`, `public/medic_logo_aba1.png`); vector version pending.
- Voice: warm, welcoming, plain Portuguese (pt-BR); human, never salesy.
- Technical lead (Odonto): Dra. Barbara Daniela Domingueti Dias, CRO-RJ 42247. CNPJ 43.812.444/0001-34.

## Evidence on Hand
- Contact: Praça das Nações Unidas, 60 – Ano Bom, Barra Mansa – RJ, 27323-360; phone (24) 3323-9990; WhatsApp (24) 99935-9784.
- Three 5-star reviews from the current site (humanized care and fair price; excellent service and beautiful clinic; beautiful and comfortable clinic). Replace with real Google reviews when collected.
- No real clinic photos, team photos, patient counts or years-in-business data yet. Do not fabricate numbers, testimonials, or staff.

## Product Principles
1. Every path leads to WhatsApp: one clear action, reachable from anywhere on the page.
2. Trust is earned with real facts (named professional, CRO, address, real reviews), never with claims.
3. Speak to the family: care for the whole household, warm and human before technical.
4. Compliance first: CFO rules override persuasion.
5. Mobile is the main stage: fast, legible, thumb-friendly.

## Accessibility & Inclusion
WCAG 2.2 AA: AA contrast, keyboard-navigable mobile menu, visible focus, skip link, descriptive alt text, `prefers-reduced-motion` respected.
