import re
try:
    from confusable_homoglyphs import confusables
except ImportError:
    confusables = None

ZERO_WIDTH_CHARS = {
    'ZWSP': '\u200b',
    'ZWNJ': '\u200c',
    'ZWJ':  '\u200d',
    'WJ':   '\u2060',
    'ZWNBSP/BOM': '\ufeff'
}

def analyze_text(text: str) -> dict:
    results = {
        "zero_width_chars": {},
        "total_zero_width": 0,
        "is_suspicious": False,
        "cleaned_text": text
    }

    # 1. Check for Zero Width Characters
    for name, char in ZERO_WIDTH_CHARS.items():
        count = text.count(char)
        if count > 0:
            results["zero_width_chars"][name] = count
            results["total_zero_width"] += count

    # 2. Clean the text
    if results["total_zero_width"] > 0:
        results["is_suspicious"] = True
        pattern = re.compile(r'[\u200b-\u200d\u2060\ufeff]')
        results["cleaned_text"] = pattern.sub('', text)
        
    # 3. Check for Zalgo (excessive combining characters)
    # Combining diacritical marks are in range \u0300-\u036F
    zalgo_pattern = re.compile(r'[\u0300-\u036F]{3,}')
    zalgo_matches = zalgo_pattern.findall(text)
    results["zalgo_instances"] = len(zalgo_matches)
    if results["zalgo_instances"] > 0:
        results["is_suspicious"] = True
        # Naive cleaning: remove all combining characters if excessive zalgo detected
        results["cleaned_text"] = re.sub(r'[\u0300-\u036F]', '', results["cleaned_text"])

    # 4. Check for Homoglyphs
    if confusables and confusables.is_dangerous(text):
        results["is_dangerous_homoglyph"] = True
        results["is_suspicious"] = True

    return results
