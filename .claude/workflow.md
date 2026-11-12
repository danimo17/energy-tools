# Workflow by stories

## Document map (`.claude/`)
| File | Purpose |
|------|---------|
| `hard-rules.md` | Rules that are always followed |
| `decisions.md` | Decision log with the why and what each affects |
| `stories.md` | Ordered stories with scope, files, tests and acceptance criteria |
| `workflow.md` | This file: how we work |

## Branch and commits
- A single branch `feat/invoices-upload` from `main` (D23). Each story = one commit `S<n>: <title>`, in English.
- Never push to `main`. At the end: `git push -u origin feat/invoices-upload` and `gh pr create` against `main` (D18).
- No Claude attribution in commits or the PR (D27). Do not commit `src/main/resources/static` (D26).

## For each story
Each story is one task and a complete process, one at a time:

1. Read `hard-rules.md`, the related decisions and the story in `stories.md`.
2. Implement only the story's scope.
3. Write the story's tests and keep them green: `npm test -- --watch=false --browsers=ChromeHeadless`.
4. Run `npm run format`, `npm run lint` and the build: `npx ng build --output-path <temporary dir>`.
5. Update the documents (see below) and mark the story as done in `stories.md`.
6. Commit `S<n>: ...`.

When all the stories are done: push the branch and open the PR.

## Definition of done
- Tests and build green, no new warnings.
- No violation of `hard-rules.md`.
- Texts in ca and es.
- Documents up to date.

## Update discipline (D37)
Whenever a decision or rule is made, or a story (running or being described) is modified:
1. Record it in `decisions.md` with the why and what it affects (and mark the one it replaces as superseded).
2. If it is a permanent rule, add it to `hard-rules.md`.
3. Reflect it in `stories.md` (scope/criteria) of the affected stories.
4. If it must be explained to the company, add it to the README ("Resolució de l'exercici") and, if it changes how we work, review `CLAUDE.md`.
Nothing counts as done until every affected file agrees.
