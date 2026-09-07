import React, { useState } from 'react';
import Dropzone from './components/Dropzone';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (data, type) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let response;
      if (type === 'file') {
        const formData = new FormData();
        formData.append('file', data);

        // Determine file type
        const fileType = data.type || '';
        const fileName = data.name || '';
        const isImage = fileType.startsWith('image/');
        const isPdf = fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
        const isAudio = fileType.startsWith('audio/') || fileName.toLowerCase().endsWith('.wav');

        let endpoint = 'http://localhost:8000/analyze/text';
        if (isImage) endpoint = 'http://localhost:8000/analyze/image';
        else if (isPdf) endpoint = 'http://localhost:8000/analyze/pdf';
        else if (isAudio) endpoint = 'http://localhost:8000/analyze/audio';

        if (!isImage && !isPdf && !isAudio) {
          // If it's a text file, read it first
          const text = await data.text();
          response = await fetch('http://localhost:8000/analyze/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
          });
        } else {
          response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
          });
        }

      } else if (type === 'text') {
        response = await fetch('http://localhost:8000/analyze/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data })
        });
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const resultData = await response.json();
      setResults(resultData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-4">
            Hidden Text Detector
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Detect invisible watermarks, zero-width characters, steganography, and hidden payloads in text and images.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : !results && !error ? (
          <Dropzone onAnalyze={handleAnalyze} />
        ) : (
          <ResultsPanel results={results} error={error} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
