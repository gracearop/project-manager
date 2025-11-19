// create-structure.js
const fs = require("fs");
const path = require("path");

// Define your folder and file structure
const structure = {
  src: {
    components: ["Board.jsx", "TaskCard.jsx", "Navbar.jsx", "Sidebar.jsx"],
    pages: ["Dashboard.jsx", "Login.jsx"],
    context: ["BoardContext.jsx"],
    utils: ["storage.js"],
    files: ["App.jsx", "index.js", "index.css"],
  },
};

// Helper function to create folders and files
function createStructure(base, config) {
  // Create main src directory
  if (!fs.existsSync(base)) fs.mkdirSync(base);

  // Create subfolders
  Object.keys(config).forEach((key) => {
    if (key === "files") {
      config[key].forEach((file) => {
        const filePath = path.join(base, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, `// ${file}\n`, "utf8");
          console.log(`📝 Created file: ${filePath}`);
        }
      });
    } else {
      const folderPath = path.join(base, key);
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

      // Create files inside the folder
      config[key].forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, `// ${file}\n`, "utf8");
          console.log(`📁 Created file: ${filePath}`);
        }
      });
    }
  });
}

// Run the function
createStructure("src", structure.src);

console.log("\n✅ Folder structure created successfully!");
