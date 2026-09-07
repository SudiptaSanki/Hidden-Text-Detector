import io
import numpy as np
from scipy.io import wavfile

def analyze_audio(file_bytes: bytes) -> dict:
    results = {
        "is_suspicious": False,
        "lsb_variance": None
    }
    
    try:
        # Load the wav file
        sample_rate, data = wavfile.read(io.BytesIO(file_bytes))
        
        # If stereo, just check the first channel
        if len(data.shape) > 1:
            data = data[:, 0]
            
        # Ensure it's integer type
        if not np.issubdtype(data.dtype, np.integer):
            results["error"] = "Audio data is not an integer type, LSB steganography check not applicable."
            return results
            
        # Extract LSB
        lsb = data & 1
        
        # Calculate variance
        variance = np.var(lsb)
        results["lsb_variance"] = float(variance)
        
        # Variance of perfectly random LSB is 0.25
        # We flag if it is very close to 0.25 (e.g. 0.249 to 0.251)
        if 0.249 < variance < 0.251:
            results["suspicious_lsb"] = True
            results["is_suspicious"] = True
        else:
            results["suspicious_lsb"] = False
            
    except Exception as e:
        results["error"] = f"Failed to parse WAV file: {str(e)}"
        
    return results
