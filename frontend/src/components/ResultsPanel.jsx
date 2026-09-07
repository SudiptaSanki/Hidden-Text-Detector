import React from 'react';

const ResultsPanel = ({ results, error, onReset }) => {
    if (error) {
        return (
            <div className="w-full max-w-3xl mx-auto mt-10 p-6 bg-white border border-red-200 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Analysis Failed</h2>
                <p className="text-gray-700 font-mono text-sm">{error}</p>
                <button onClick={onReset} className="mt-6 bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800">Try Again</button>
            </div>
        );
    }

    if (!results) return null;

    const isSuspicious = results.is_suspicious;

    return (
        <div className="w-full max-w-3xl mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black tracking-tight text-gray-900">Analysis Results</h2>
                <div className={`px-4 py-1 rounded-full font-bold text-sm ${isSuspicious ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {isSuspicious ? 'THREAT DETECTED' : 'CLEAN'}
                </div>
            </div>

            <div className="space-y-6">
                {results.c2pa_manifest_detected && (
                    <div className="border-l-4 border-black pl-4 bg-gray-50 p-3 rounded">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center">
                            AI Provenance / C2PA Detected
                            <span className="ml-2 bg-black text-white text-xs px-2 py-1 rounded">WARNING</span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">This file contains embedded AI metadata signatures (C2PA/JUMBF), indicating it may be AI-generated or altered.</p>
                    </div>
                )}

                {results.is_dangerous_homoglyph && (
                    <div className="border-l-4 border-black pl-4 bg-gray-50 p-3 rounded">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center">
                            Homoglyph Attack Detected
                            <span className="ml-2 bg-black text-white text-xs px-2 py-1 rounded">WARNING</span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">The text contains mixed scripts (e.g., Cyrillic characters mixed with Latin) specifically designed to spoof legitimate words.</p>
                    </div>
                )}
                {results.total_zero_width !== undefined && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">Zero-Width Characters</h3>
                        <p className="text-gray-600">Total found: <span className="font-bold text-black">{results.total_zero_width}</span></p>
                        {Object.entries(results.zero_width_chars || {}).length > 0 && (
                            <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                                {Object.entries(results.zero_width_chars).map(([name, count]) => (
                                    <li key={name}>{name}: {count} instance(s)</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {results.zalgo_instances !== undefined && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">Zalgo / Combos</h3>
                        <p className="text-gray-600">Instances detected: <span className="font-bold text-black">{results.zalgo_instances}</span></p>
                    </div>
                )}

                {results.metadata_hidden_text && results.metadata_hidden_text.length > 0 && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">Suspicious EXIF Metadata</h3>
                        <div className="mt-2 space-y-2">
                            {results.metadata_hidden_text.map((item, idx) => (
                                <div key={idx} className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-700">
                                    <span className="font-bold">{item.tag}</span> ({item.length} chars): {item.preview}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results.lsb_variance !== undefined && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">LSB Steganography Analysis</h3>
                        <p className="text-gray-600">Blue Channel LSB Variance: <span className="font-bold font-mono">{results.lsb_variance.toFixed(4)}</span></p>
                        <p className="text-sm text-gray-500 mt-1">
                            {results.suspicious_lsb 
                                ? "Variance is very close to 0.25 (random), suggesting encrypted hidden data."
                                : "Variance looks natural."}
                        </p>
                    </div>
                )}

                {results.transparency_anomaly !== undefined && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">Alpha Channel Anomalies</h3>
                        {results.transparency_anomaly ? (
                            <div>
                                <p className="text-gray-600 font-bold">Suspicious transparency values detected!</p>
                                <p className="text-sm text-gray-500 font-mono mt-1">Sample values: {results.suspicious_alpha_values?.join(', ')}</p>
                            </div>
                        ) : (
                            <p className="text-gray-600">No anomalies found.</p>
                        )}
                    </div>
                )}

                {results.low_contrast_anomalies !== undefined && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">Low-Contrast Text/Anomalies</h3>
                        {results.low_contrast_anomalies > 0 ? (
                            <p className="text-gray-600 font-bold">Found {results.low_contrast_anomalies} faint edge anomalies (potentially hidden low-contrast text).</p>
                        ) : (
                            <p className="text-gray-600">No low-contrast anomalies found.</p>
                        )}
                    </div>
                )}

                {results.white_text_spans && results.white_text_spans.length > 0 && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">Hidden White Text (PDF)</h3>
                        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                            {results.white_text_spans.map((span, idx) => (
                                <li key={idx}>Page {span.page}: "{span.text}"</li>
                            ))}
                        </ul>
                    </div>
                )}

                {results.micro_text_spans && results.micro_text_spans.length > 0 && (
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-bold text-lg text-gray-900">Micro-Text (PDF)</h3>
                        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                            {results.micro_text_spans.map((span, idx) => (
                                <li key={idx}>Page {span.page} (Size: {span.size.toFixed(1)}pt): "{span.text}"</li>
                            ))}
                        </ul>
                    </div>
                )}

                {results.cleaned_text && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-xl text-gray-900 mb-4">Cleaned Output</h3>
                        <div className="bg-gray-50 border border-gray-300 rounded p-4 font-mono text-sm whitespace-pre-wrap text-gray-800">
                            {results.cleaned_text}
                        </div>
                    </div>
                )}
            </div>

            <button onClick={onReset} className="mt-10 w-full border-2 border-black text-black py-3 rounded font-bold hover:bg-black hover:text-white transition-colors">
                Analyze Another
            </button>
        </div>
    );
};

export default ResultsPanel;
