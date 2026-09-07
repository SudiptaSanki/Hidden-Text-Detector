import pymupdf

def analyze_pdf(file_bytes: bytes) -> dict:
    results = {
        "white_text_spans": [],
        "micro_text_spans": [],
        "is_suspicious": False
    }
    
    try:
        doc = pymupdf.open(stream=file_bytes, filetype="pdf")
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            blocks = page.get_text("dict", flags=11).get("blocks", [])
            
            for b in blocks:
                if "lines" in b:
                    for l in b["lines"]:
                        for s in l["spans"]:
                            text = s.get("text", "").strip()
                            if not text:
                                continue
                            
                            color = s.get("color")
                            size = s.get("size")
                            
                            # 16777215 is 0xFFFFFF (White)
                            if color == 16777215:
                                results["white_text_spans"].append({
                                    "page": page_num + 1,
                                    "text": text[:50] + ("..." if len(text) > 50 else "")
                                })
                                results["is_suspicious"] = True
                            
                            # Check for micro-text (e.g. size < 2 points)
                            if size and size < 2.0:
                                results["micro_text_spans"].append({
                                    "page": page_num + 1,
                                    "text": text[:50] + ("..." if len(text) > 50 else ""),
                                    "size": size
                                })
                                results["is_suspicious"] = True
        doc.close()
    except Exception as e:
        results["error"] = str(e)
        
    return results
