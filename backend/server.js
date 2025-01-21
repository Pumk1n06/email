const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB setup with error handling
mongoose
  .connect("mongodb://0.0.0.0/emailTemplates", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define EmailTemplate model while avoiding OverwriteModelError
const emailTemplateSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  logo: String,
});

const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", emailTemplateSchema);

// Get Email Layout
app.get("/getEmailLayout", (req, res) => {
  fs.readFile(path.join(__dirname, "layout.html"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error loading layout" });
    }
    res.send(data);
  });
});

// Image Upload (for general images and logos)
const upload = multer({ dest: "uploads/" });

app.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Save Email Configuration (including image and logo)
app.post("/uploadEmailConfig", async (req, res) => {
  try {
    const { title, content, image, logo } = req.body;
    await EmailTemplate.create({ title, content, image, logo });
    res.json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error saving configuration" });
  }
});

// Render and Download Email Template
app.post("/renderAndDownloadTemplate", async (req, res) => {
  try {
    const { title, content, image, logo } = req.body;
    const template = fs.readFileSync(path.join(__dirname, "layout.html"), "utf8");

    const renderedTemplate = template
      .replace("{{title}}", title)
      .replace("{{content}}", content)
      .replace("{{image}}", image || "")
      .replace("{{logo}}", logo || "");

    res.setHeader("Content-Disposition", "attachment; filename=email_template.html");
    res.setHeader("Content-Type", "text/html");
    res.send(renderedTemplate);
  } catch (err) {
    res.status(500).json({ error: "Error rendering template" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
