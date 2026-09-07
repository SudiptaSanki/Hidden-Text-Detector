# Hidden-Text-Detector 🕵️‍♂️

An open-source, powerful tool designed to identify, analyze, and extract hidden text, invisible watermarks, steganography, and maliciously obfuscated payloads from AI-generated media, documents, and text files.

## 🌟 Features

*   **Text Analysis**: Detects and cleans Zero-Width Characters (ZWSP, ZWNJ), excessive combining marks (Zalgo text), and **Homoglyph Attacks** (mixed-script spoofing).
*   **Image Steganalysis**: Extracts EXIF metadata, checks Alpha transparency channels, and performs LSB (Least Significant Bit) statistical analysis to spot encrypted steganography payloads.
*   **AI Provenance Verification**: Reads binary headers to spot embedded C2PA/JUMBF manifests, flagging explicitly AI-generated or tampered images.
*   **Color-Contrast Anomaly Detection**: Uses OpenCV edge detection to highlight faint anomalies where text is almost imperceptibly blended into the background.
*   **PDF Parsing & ATS Bypass Detection**: Extracts "invisible" white text and micro-text used to bypass Applicant Tracking Systems (ATS) and automated filters.
*   **Audio Steganography**: Analyzes `.wav` files to calculate LSB variance on uncompressed audio streams.

## 🛠️ Tech Stack

This project uses a decoupled architecture for maximum flexibility and performance:
*   **Backend**: Python, FastAPI, NumPy, OpenCV, PyMuPDF, SciPy, confusable_homoglyphs.
*   **Frontend**: React, Vite, TailwindCSS (Premium Black & White Aesthetic).

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   Python (3.9+)

### 1. Setup the Backend
Navigate to the backend directory, create a virtual environment, and start the API.
```bash
cd backend
python -m venv venv

# On Windows: 
.\venv\Scripts\activate

# On Mac/Linux: 
source venv/bin/activate

pip install fastapi uvicorn Pillow numpy python-multipart exifread c2pa-python pymupdf confusable_homoglyphs scipy opencv-python-headless
uvicorn main:app --reload
```
*The backend will run on `http://localhost:8000`*

### 2. Setup the Frontend
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server.
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173` (or similar). Open this URL in your browser.*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit pull requests. If you are adding a new detection algorithm, please ensure it runs efficiently to keep the local server lightweight.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
