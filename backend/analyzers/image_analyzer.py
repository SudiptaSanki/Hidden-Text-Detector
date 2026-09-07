from PIL import Image
import exifread
import io
import numpy as np
import cv2

def analyze_image(file_bytes: bytes) -> dict:
    results = {
        "metadata_hidden_text": [],
        "suspicious_lsb": False,
        "is_suspicious": False,
        "transparency_anomaly": False,
        "c2pa_manifest_detected": False
    }

    # Basic C2PA / JUMBF signature check
    if b'c2pa' in file_bytes or b'jumb' in file_bytes:
        results["c2pa_manifest_detected"] = True

    # 1. Check Metadata / EXIF
    try:
        tags = exifread.process_file(io.BytesIO(file_bytes), details=False)
        for tag, value in tags.items():
            if tag not in ('JPEGThumbnail', 'TIFFThumbnail', 'Filename', 'EXIF MakerNote'):
                val_str = str(value)
                # Check for suspiciously long string values in metadata which might be hidden payloads
                if len(val_str) > 200:
                    results["metadata_hidden_text"].append({
                        "tag": tag,
                        "length": len(val_str),
                        "preview": val_str[:50] + "..."
                    })
                    results["is_suspicious"] = True
    except Exception as e:
        pass

    # Load image for pixel analysis
    try:
        img = Image.open(io.BytesIO(file_bytes))
        
        # 2. Check for Transparency anomalies (Alpha channel)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            # Convert to RGBA
            img_rgba = img.convert("RGBA")
            data = np.array(img_rgba)
            alpha = data[:,:,3]
            
            # Check if there are varying alpha values that are not 0 or 255
            # Hidden data in alpha channel often uses values like 254
            unique_alphas = np.unique(alpha)
            suspicious_alphas = [a for a in unique_alphas if 0 < a < 255]
            if suspicious_alphas:
                results["transparency_anomaly"] = True
                results["is_suspicious"] = True
                results["suspicious_alpha_values"] = [int(a) for a in suspicious_alphas[:5]] # report up to 5

        # 3. LSB Variance Check (Simple heuristic)
        # Convert to RGB, take one channel, get LSB, compute variance
        img_rgb = img.convert("RGB")
        data_rgb = np.array(img_rgb)
        
        # We will check the Blue channel's LSB
        blue_channel = data_rgb[:, :, 2]
        lsb_blue = blue_channel & 1
        
        # In a natural image, LSBs are pseudo-random but often have local correlation.
        # If LSB is completely random (variance near 0.25), it *might* contain encrypted steganography.
        # This is a very basic heuristic.
        variance_lsb = np.var(lsb_blue)
        
        # Natural images often have variance slightly lower than 0.25, encrypted data is very close to 0.25
        results["lsb_variance"] = float(variance_lsb)
        if 0.249 < variance_lsb < 0.251:
            results["suspicious_lsb"] = True
            results["is_suspicious"] = True
            
        # 4. Low Contrast Anomaly Check (Edge difference)
        img_cv = cv2.cvtColor(np.array(img_rgb), cv2.COLOR_RGB2GRAY)
        edges_low = cv2.Canny(img_cv, 10, 50)
        edges_high = cv2.Canny(img_cv, 50, 150)
        faint_edges = np.sum(edges_low > 0) - np.sum(edges_high > 0)
        if faint_edges > 2000: # Threshold for faint details
            results["low_contrast_anomalies"] = int(faint_edges)

    except Exception as e:
        results["error"] = str(e)

    return results
