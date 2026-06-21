#!/usr/bin/env bun

import { spawn } from "child_process"
import { watch } from "fs"

// Serve draft posts when running locally
process.env.INCLUDE_DRAFTS = "true"

// Debounce function to prevent multiple rebuilds
let rebuildTimeout: NodeJS.Timeout | null = null
const debounceRebuild = (filename: string) => {
  if (rebuildTimeout) {
    clearTimeout(rebuildTimeout)
  }
  
  rebuildTimeout = setTimeout(() => {
    console.log(`\n📝 Content changed: ${filename}`)
    console.log("🔄 Rebuilding...")
    
    // Rebuild the site
    Bun.$`bun run build`.then(() => {
      console.log("✅ Rebuild complete!")
    }).catch((err) => {
      console.error("❌ Rebuild failed:", err)
    })
  }, 300) // Wait 300ms before rebuilding
}

// Initial build
console.log("🔨 Building site...")
await Bun.$`bun run build`

console.log("🚀 Starting dev server...")
console.log("👀 Watching for changes...")

// Start the server with watch mode
const serverProcess = spawn("bun", ["--watch", "server.ts"], {
  stdio: "inherit",
})

// Watch content directory for changes
const contentDir = "./content"
const contentWatcher = watch(contentDir, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.md')) {
    debounceRebuild(filename)
  }
})

// Handle cleanup
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...")
  if (rebuildTimeout) clearTimeout(rebuildTimeout)
  serverProcess.kill()
  contentWatcher.close()
  process.exit(0)
})

// Wait for processes
await new Promise(() => {})
