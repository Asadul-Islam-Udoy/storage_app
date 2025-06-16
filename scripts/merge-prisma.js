const fs = require("fs");
const path = require("path");

const modelsDir = path.join(__dirname, "../prisma/models");
const outputFile = path.join(__dirname, "../prisma/schema.prisma");

let mergedContent = `// Auto-generated schema.prisma\n\n`;

mergedContent += `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`;

fs.readdirSync(modelsDir).forEach((file) => {
  if (file.endsWith(".prisma")) {
    const content = fs.readFileSync(path.join(modelsDir, file), "utf-8");
    mergedContent += `// File: ${file}\n${content}\n\n`;
  }
});

fs.writeFileSync(outputFile, mergedContent);
console.log("✅ Merged models into schema.prisma");
