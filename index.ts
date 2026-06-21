// Entry point — runs the build engine.
// Architecture: content/ (invariant) -> src/ (engine) -> site/ (presentation) -> public/.
// See AGENTS.md / README.md for what to edit where.

import { buildSite } from "./src/build"

await buildSite()
