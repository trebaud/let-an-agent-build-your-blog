const BASE_PATH = "./public";

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = BASE_PATH + url.pathname;
    
    // Default to index.html if a directory is requested
    if (filePath.endsWith("/")) {
      filePath += "index.html";
    } else {
      // Check if the path is a directory (no extension) and try index.html
      const file = Bun.file(filePath);
      if (!(await file.exists())) {
        const indexFilePath = filePath + "/index.html";
        const indexFile = Bun.file(indexFilePath);
        if (await indexFile.exists()) {
          return new Response(indexFile);
        }
      }
    }

    const finalFile = Bun.file(filePath);
    
    // Bun.file automatically sets Content-Type based on extension
    return new Response(finalFile);
  },
  error() {
    return new Response("Not Found", { status: 404 });
  },
});

console.log("Serving ./public at http://localhost:3000");
