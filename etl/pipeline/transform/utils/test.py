from rapidfuzz import fuzz, process

# Example strings
query = ""
choices = ["4", "5", "5-6", "4-8", ""]

# Using different scorers
best_match_ratio = process.extractOne(query, choices, scorer=fuzz.ratio)
best_match_partial_ratio = process.extractOne(query, choices, scorer=fuzz.partial_ratio)
best_match_token_sort_ratio = process.extractOne(
    query, choices, scorer=fuzz.token_sort_ratio
)
best_match_token_set_ratio = process.extractOne(
    query, choices, scorer=fuzz.token_set_ratio
)
best_match_qratio = process.extractOne(query, choices, scorer=fuzz.QRatio)
best_match_wratio = process.extractOne(query, choices, scorer=fuzz.WRatio)

print("Best match using fuzz.ratio:", best_match_ratio)
print("Best match using fuzz.partial_ratio:", best_match_partial_ratio)
print("Best match using fuzz.token_sort_ratio:", best_match_token_sort_ratio)
print("Best match using fuzz.token_set_ratio:", best_match_token_set_ratio)
print("Best match using fuzz.QRatio:", best_match_qratio)
print("Best match using fuzz.WRatio:", best_match_wratio)
