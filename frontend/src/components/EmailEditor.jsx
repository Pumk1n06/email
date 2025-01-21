import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const EmailEditor = () => {
  const [emailData, setEmailData] = useState({
    title: "Email has never been easier",
    body: "Create beautiful and sophisticated emails in minutes.",
    image: "",
    logo: "",
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    axios.get("https://email-backend-fqg8.onrender.com/getEmailLayout").then((response) => {
      setEmailData(response.data);
    });
  }, []);

  const handleChange = (field, value) => {
    setEmailData({ ...emailData, [field]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("https://email-backend-fqg8.onrender.com/uploadImage", formData);
      setEmailData({ ...emailData, image: res.data.imageUrl });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("https://email-backend-fqg8.onrender.com/uploadImage", formData);
      setEmailData({ ...emailData, logo: res.data.imageUrl });
    } catch (error) {
      console.error("Error uploading logo", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("https://email-backend-fqg8.onrender.com/uploadEmailConfig", emailData);
      alert("Email template saved!");
    } catch (error) {
      console.error("Error saving template", error);
    }
  };

  const handleDownload = () => {
    window.location.href = "https://email-backend-fqg8.onrender.com/renderAndDownloadTemplate";
  };

  return (
    <div className="email-editor-container">
      {/* Live Preview */}
      <div className="email-preview">
        <button className="add-logo-button">ADD LOGO</button>

        <h2>{emailData.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: emailData.body }} />
        {emailData.image && <img src={emailData.image} alt="Email Preview" className="email-image" />}
      </div>

      {/* Settings Panel */}
      <div className="settings-panel">
        <h3>Edit Content</h3>

        <label>Title:</label>
        <input 
          type="text" 
          value={emailData.title} 
          onChange={(e) => handleChange("title", e.target.value)} 
          className="input-field"
        />

        <label>Body:</label>
        <ReactQuill value={emailData.body} onChange={(value) => handleChange("body", value)} className="quill-editor" />

        <label>Upload Image:</label>
        <input type="file" onChange={handleImageUpload} className="input-field" />

        <label>Upload Logo:</label>
        <input type="file" onChange={handleLogoUpload} className="input-field" />

        <button onClick={handleSave} className="save-button">
          Save Configuration
        </button>

        <button onClick={handleDownload} className="download-button">
          Download Template
        </button>
        <button onClick={() => setPreviewOpen(true)} className="preview-button">
          Preview Email
        </button>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="preview-modal">
          <div className="preview-modal-content">
            <h2>{emailData.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: emailData.body }} />
            {emailData.image && <img src={emailData.image} alt="Email Preview" className="email-image" />}
            <button onClick={() => setPreviewOpen(false)} className="close-preview-button">
              Close Preview
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Global styles */
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }

        .email-editor-container {
          display: flex;
          justify-content: space-between;
          padding: 20px;
        }

        .email-preview {
          width: 60%;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .add-logo-button {
          display: block;
          margin: 0 auto 20px;
          padding: 8px 16px;
          background-color: #4caf50;
          color: white;
          font-size: 14px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .add-logo-button:hover {
          background-color: #45a049;
        }

        .email-image {
          width: 100%;
          margin-top: 20px;
          border-radius: 8px;
        }

        .settings-panel {
          width: 35%;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .settings-panel h3 {
          margin-bottom: 20px;
          color: #333;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .quill-editor {
          margin-bottom: 15px;
        }

        .save-button,
        .download-button,
        .preview-button {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .save-button {
          background-color: #4caf50;
          color: white;
        }

        .download-button {
          background-color: #2196f3;
          color: white;
        }

        .preview-button {
          background-color: #ff9800;
          color: white;
        }

        .save-button:hover,
        .download-button:hover,
        .preview-button:hover {
          opacity: 0.9;
        }

        .preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .preview-modal-content {
          background: white;
          padding: 20px;
          width: 60%;
          border-radius: 8px;
          text-align: center;
        }

        .close-preview-button {
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .close-preview-button:hover {
          background-color: #e53935;
        }
      `}</style>
    </div>
  );
};

export default EmailEditor;
