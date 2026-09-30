from typing import List


RISK_KEYWORDS = ["indemnify", "penalty", "liability", "termination"]


def scan_risky_clauses(text: str) -> List[str]:
    lowered = text.lower()
    return [keyword for keyword in RISK_KEYWORDS if keyword in lowered]
