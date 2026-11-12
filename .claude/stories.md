# Stories

One branch (`feat/invoices-upload`), one commit per story, in this order (D23). Decisions and their why are in `decisions.md`. Status: ☐ pending · ☑ done.

NOTE (D58): the tests listed below are the ones that exist today. The suite was reduced to the logic the exercise needs plus component tests for the Button and the Drawer only; where a story says "no tests", it was checked by hand in the browser.

Common criteria for every story (Definition of done, `workflow.md`): tests and build green, rules respected, texts in ca and es, documents up to date.

## ☑ S0 · Base
**Decisions:** D14, D19, D21, D22, D1, D40.
**Done:** `AppModule`/`app-routing` (lazy routes), `HttpClientModule`; `styles/` with `_palette.scss` (the only place with hex values) + tokens + dark theme + base element styles + utilities, and `_severities.scss` (a single severity list generating tokens and classes); `helpers/` (storage, `Intl` formatting), `core/store` (store base); `core/i18n` (service, `t` pipe, ca/es translations); `features/theme` (service). Removed the example `GreetingService`.
**Tests:** formatting (`format.spec`). Checked by hand: language and theme.

## ☑ S1 · Basic UI and menu
**Decisions:** D28, D29, D16, D15, D24, D33.
**Done:** `components/button` (visual part and `pressed`; the `action`/`confirm`/toast logic arrives in S2), `button.defaults.ts`, `card`, `description`, `icon` (inline SVG icons, no library), `ui.module.ts`; later (D45) `page-header` and `button-list` (the `input` component was removed again in D60); `features/menu` (side menu + language selector + theme toggle — moved to a settings drawer in S8); `pages/dashboard`. `ButtonConfig` is already complete.
**Tests:** button (variants, `pressed`, disabled/loading, icon-only). Checked by hand: card, menu.

## ☑ S1b · Tooling and English pass
**Decisions:** D41, D42, D43.
**Do:** ESLint (typescript-eslint + angular-eslint) and Prettier configured with scripts `lint`, `format`, `format:check`; stricter typing (explicit return types, no `any`); format the whole codebase; translate all comments, test names and docs to English.
**Acceptance:** `npm run lint` and `npm run format:check` pass; tests and build green.

## ☑ S2 · Feedback and containers
**Decisions:** D4, D5, D6, D7, D33, D15, D39.
**Do:** `components/toast` (+ `NotificationService`, `NotificationsStore`, host, `withToasts`: queue, 5 s, 4 severities, colors with opacity); `components/overlay` (shared base), `components/dialog` and `components/drawer` (shells rendering one Card from a `CardConfig`); `ConfirmService` + host; `app-button` logic (`action`, `confirm`/`confirmMessage`, `successToast`/`successMessage`, `actionType`); `components/table` (columns + a last column with row actions using `ButtonConfig`); hosts placed in `AppComponent`.
**Tests:** `withToasts` (error always, success by `write`/prop), button with `action` (loading, confirmation yes/no, toasts), drawer (one Card, closes on cross/Esc/outside click, header actions, from the left, out animation). Checked by hand: toast, dialog, table, confirmation.
**Acceptance:** one toast of each severity; Dialog centered and Drawer on the right, full height, no border radius; a button with `confirm` and `action` behaves the same everywhere by only changing props.

## ☑ S3 · Invoices: types and rules
**Decisions:** D10, D11, D12, D34, D35, D36.
**Do:** `features/invoices/types` (`Invoice`, `InvoiceDraft`, `InvoiceFormat`); `helpers/formats` (format A, B, registry); one list of rules (`helpers/rules`, D34), and calculations (21 % tax, total).
**Tests:** the 6 sample invoices with the expected results listed in the README section "Resolució de l'exercici"; invalid JSON, unknown format and missing base → blocking; missing tax/total → computed.
**Acceptance:** adding a format = new files + one registry line (nothing else changes).

## ☑ S4 · Service, mock and store
**Decisions:** D1, D2, D35.
**Do:** `core/crud/crud-mock.interceptor.ts` (GET/POST/PUT/DELETE in memory, simulated latency) registered for `/api/invoices` in `features/invoices/services/invoices.mock.ts`; `services/invoices.service.ts`; `store/invoices.store.ts` (`items$`, `loading$`, `load`, `create`, `update`, `remove` return Observable; `findByNumber`).
**Tests:** interceptor + service (create, list, update, delete, ids, 404); store (state after each operation, lookup by number).
**Acceptance:** with the interceptor, the list persists while the app stays open.

## ☑ S5 · Upload
**Decisions:** D3, D13, D4, D29, D30.
**Do:** `components/dropzone`; `core/import/components/import-dialog` (generic, D79): inside ONE Dialog (a Card) opened by the "Import" button (D49); multiple files, pending files with a cross, footer Close + Upload, sequential processing with per-file status; the results table (file / status / comments) below the dropzone in the same dialog, with each file's comments as a bulleted list and no toasts (D80); an existing number updates the invoice (D52).
**Tests:** the import rules are tested in `import-invoice.spec`; the dialog was checked by hand.
**Acceptance:** with the 6 files at once, 5 are created (A2 with warnings) and B3 is not created (blocking, D47); the results table shows each outcome.

## ☑ S6 · List, detail and delete
**Decisions:** D5, D6, D7, D15, D17, D30, D33.
**Do:** `invoice-table` (columns: number, client, date, base, tax, total; row actions: eye → Drawer, trash → confirmation); `invoice-detail` (`description` components); `pages/invoices` (page header with "Import" outside any Card + a Card with the table).
**Tests:** checked by hand (list, detail, delete with confirmation).
**Acceptance:** view and delete work; the list refreshes; translated empty state.

## ☑ S7 · Documentation and delivery
**Decisions:** D26, D32, D38, D18.
**Do:** README: final section "Resolució de l'exercici" (in Catalan) (D38): block 1 the exercise (reading, formatting, errors, CRUD, interaction, Cards, testing), block 2 not requested but considered (i18n, style, theme, roles/users, architecture, stores, typing, ESLint/Prettier), block 3 context and process; plus how to run it; push the branch and open the PR.
**Acceptance:** README consistent with the code; PR opened against `main`; `src/main/resources/static` not included.

## ☑ S8 · Review round (after the first delivery)
**Decisions:** D47, D48, D49, D50 (and D12, D13, D24, D30 updated).
**Done:** toasts with title + description; ONE import dialog with the results table below the dropzone (no dialog over dialog); language and theme moved from the menu to a settings drawer opened by a settings button (`core/settings`); empty invoice number made blocking on purpose so a blocking error can be seen with the sample data (factura_B3 is not created).
**Tests:** B3 blocked (`import-invoice.spec`); toast, single dialog and settings checked by hand.

## ☑ S9 · Responsive menu and update by number
**Decisions:** D50, D51, D52 (and D12, D24, D13 updated).
**Done:** the menu is a sidebar on wide screens and, on small screens, a top bar with a hamburger that opens/closes it as a left drawer; settings opens from the left (on small screens it replaces the content of the same drawer, with a back button); the Drawer can open from either side and below an offset; importing an existing invoice number updates the invoice (PUT) instead of creating a duplicate and the results table and the toast say so.
**Header actions (D53):** the back action is an icon in the drawer header next to the close cross (header = Card header: optional title + icon-only actions).
**Header actions (D54):** extra header actions go before the close icon of Dialog and Drawer.
**Tests:** drawer (header actions, from the left, offset), service and store update. Checked by hand: responsive menu, settings in the drawer, update by number.
