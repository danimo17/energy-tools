# Energy Tools

Angular 14 frontend, served as static files by the Spring Boot backend (which is not modified from here). The app is organized by business units (`features/`), app infrastructure (`core/`), generic UI (`components/`), helpers shared by several units (`helpers/`), design tokens (`styles/`) and route views (`pages/`); today it covers invoices and it is meant to grow with more units.

Before any change, read and follow:

@.claude/hard-rules.md
@.claude/workflow.md
@.claude/decisions.md
@.claude/stories.md

Every new decision or rule (or change to a story) is written in the same step to all the files it affects (`workflow.md`, "Update discipline"). Everything is in English except the ca/es translation values.
