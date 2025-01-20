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

// MongoDB setup
mongoose.connect("mongodb://0.0.0.0:27017/emailTemplates", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EmailTemplate = mongoose.model("EmailTemplate", new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  logo: String, // Added logo field
}));

// Get Email Layout
app.get("/getEmailLayout", (req, res) => {
  fs.readFile(path.join(__dirname, "layout.html"), "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error loading layout");
    } else {
      res.send(data);
    }
  });
});

// Image Upload (for general images and logos)
const upload = multer({ dest: "uploads/" });

app.post("/uploadImage", upload.single("image"), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Save Email Configuration (including image and logo)
app.post("/uploadEmailConfig", async (req, res) => {
  try {
    const { title, content, image, logo } = req.body;
    // Save the email template to the database
    await EmailTemplate.create({ title, content, image, logo });
    res.send({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).send("Error saving configuration");
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
      .replace("{{image}}", image) // Replaced the image placeholder
      .replace("{{logo}}", logo); // Replaced the logo placeholder

    res.setHeader("Content-Disposition", "attachment; filename=email_template.html");
    res.setHeader("Content-Type", "text/html");
    res.send(renderedTemplate);
  } catch (err) {
    res.status(500).send("Error rendering template");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
