import React, { useCallback, useState } from 'react';

const Dropzone = ({ onAnalyze }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [textInput, setTextInput] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onAnalyze(files[0], 'file');
        }
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onAnalyze(files[0], 'file');
        }
    };

    const handleTextSubmit = () => {
        if (textInput.trim()) {
            onAnalyze(textInput, 'text');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-10">
            <div 
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
                    isDragging ? 'border-black bg-gray-100 scale-[1.02]' : 'border-gray-300 bg-white hover:border-gray-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drag and drop files here</h3>
                <p className="text-sm text-gray-500 mb-6">Supports Images, Audio (WAV), PDF, and Text files</p>
                <label className="cursor-pointer bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 transition-colors">
                    Browse Files
                    <input type="file" className="hidden" onChange={handleFileInput} />
                </label>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <hr className="w-full border-gray-300" />
                <span className="px-4 text-gray-500 font-semibold text-sm">OR</span>
                <hr className="w-full border-gray-300" />
            </div>

            <div className="mt-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Paste text directly:</label>
                <textarea 
                    className="w-full border border-gray-300 rounded p-4 h-32 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono text-sm"
                    placeholder="Paste suspect text here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                />
                <button 
                    onClick={handleTextSubmit}
                    className="mt-4 w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-colors"
                >
                    Analyze Text
                </button>
            </div>
        </div>
    );
};

export default Dropzone;
