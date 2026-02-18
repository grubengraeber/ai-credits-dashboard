# API Credit Endpoints - Research

## OpenAI

### Costs API (Admin)
- **Endpoint:** `GET https://api.openai.com/v1/organization/costs?start_time={unix}&end_time={unix}&group_by=line_item`
- **Auth:** `Authorization: Bearer <API_KEY>` (benötigt Admin API Key)
- **Response:** JSON mit `data[].results[].amount.value` (in Cents)
- **Hinweis:** Kein direkter "Balance" Endpoint. Nur Kosten abrufbar. Guthaben nur über Dashboard sichtbar.
- **Status:** ✅ Implementiert (Kosten pro Monat)

### Usage API (deprecated/limited)
- **Endpoint:** `GET https://api.openai.com/v1/usage?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **Hinweis:** Älterer Endpoint, liefert Token-basierte Usage

---

## Anthropic

### Usage & Cost Admin API (NEU)
- **Endpoint:** `GET https://api.anthropic.com/v1/organizations/usage_report/messages?starting_at={ISO}&ending_at={ISO}&bucket_width=1d`
- **Auth:** `x-api-key: <ADMIN_API_KEY>`, `anthropic-version: 2023-06-01`
- **Response:** Token-Verbrauch aufgeschlüsselt nach Model, Workspace, Service Tier
- **Hinweis:** Benötigt **Admin API Key** (nicht normaler API Key). Kein Balance/Credits Endpoint verfügbar.
- **Balance:** ❌ Nicht per API abrufbar — nur über console.anthropic.com
- **Status:** ⚠️ Usage-Reporting möglich mit Admin Key, Balance nicht

---

## ElevenLabs

### Subscription Info
- **Endpoint:** `GET https://api.elevenlabs.io/v1/user/subscription`
- **Auth:** `xi-api-key: <API_KEY>`
- **Response:**
  ```json
  {
    "tier": "starter",
    "character_count": 12345,
    "character_limit": 100000,
    "next_character_count_reset_unix": 1234567890,
    "voice_limit": 10
  }
  ```
- **Status:** ✅ Voll implementiert (Characters used/total, Tier, Reset-Datum)

---

## Google (Gemini)

### Billing/Credits API
- **Endpoint:** Kein dedizierter Credits/Billing Endpoint für Gemini API
- **Verfügbar:** `GET https://generativelanguage.googleapis.com/v1/models?key=<API_KEY>` (Key-Validierung)
- **Billing:** Nur über Google Cloud Console / Cloud Billing API
  - Cloud Billing API: `GET https://cloudbilling.googleapis.com/v1/billingAccounts/{id}`
  - Benötigt OAuth2 + `billing.accounts.get` Permission
  - Komplex einzurichten, nicht für einfache API-Key-basierte Nutzung gedacht
- **Status:** ⚠️ Nur Key-Validierung implementiert. Credits/Billing nicht direkt abrufbar.

---

## Zusammenfassung

| Provider    | Credits/Balance API | Usage/Cost API | Implementiert |
|------------|-------------------|----------------|---------------|
| OpenAI     | ❌                 | ✅ (Admin Key)  | ✅ Kosten/Monat |
| Anthropic  | ❌                 | ✅ (Admin Key)  | ⚠️ Nur Key-Check |
| ElevenLabs | ✅                 | ✅              | ✅ Voll        |
| Google     | ❌                 | ❌ (nur Cloud)  | ⚠️ Nur Key-Check |
