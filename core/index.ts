// Entry point — runs the build engine.
// Architecture: content/ (writing) -> core/ (engine) -> site/ (presentation) -> public/.
// See AGENTS.md / README.md for what to edit where.

import { buildSite } from "./build"

await buildSite()
