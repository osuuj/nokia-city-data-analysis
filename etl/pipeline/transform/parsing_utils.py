"""This module contains utility functions for parsing and normalizing address data."""

import re


def normalize_street(street):
    """Normalize the 'street' column by standardizing abbreviations and common patterns.

    Args:
        street (str): The street name to normalize.

    Returns:
        str: The normalized street name.
    """
    if not isinstance(street, str) or not street.strip():
        return street

    # Remove text that starts with 'A' or 'Aa'
    street = re.sub(r"^(Aa? )", "", street, flags=re.IGNORECASE).strip()

    # Remove parentheses
    street = re.sub(r"[()]", "", street)

    # Combine specific replacements into one dictionary
    replacements = {
        **{
            r"\bpohj\.\s*": "Pohjoinen ",
            r"\bpohj\b": "Pohjoinen",
            r"\bö\.\s*": "Östra ",
            r"\betel\.\s*": "Eteläinen ",
            r"\bet\.\s*": "Eteläinen ",  # Specific rule for "Et." or "Et. "
            r"\bet\.(?!\s)": "Eteläinen ",
            r"\bf\.e\.(?!\s)": "F.E. ",
            r"\bf\.o\.(?!\s)": "F.O. ",
            r"\be\.j\.(?!\s)": "E.J. ",
            r"\bf\.\s*o\.\s*": "F.O. ",
            r"\bj\.\s*h\.\s*": "J.H. ",
            r"\bv\.i\.(?!\s)": "V.I. ",
            r"\bSkata-Mjödträsk V.\b": "Skata-Mjödträskvägen",
            r"\bRoihuv.Tie\b": "Roihuvuorentie",
            r"\bRevontie Ll Krs\.\b": "Revontie",
            r"\bKesk. Eläkevak.yhtiö Ilmarinen\b": "Keskus Eläkevakuutusyhtiö Ilmarinen, Porkkalankatu 1",
            r"\bKoivukuja 2.A.1\b": "Koivukuja 2 A 1",
            r"\bHollantil\.Tie\b": "Hollantilaisentie",
            r"\bIt.Pitkäkat\b": "Itäinen Pitkäkatu",
            r"\bitiepitkäkatie\b": "Itäinen Pitkäkatu",
            r"\bvaasanp\b\.": "Vaasanpuistikko",
            r"\bUrho Kekkonens Gatan 3 B. 5. Våningen\b": "Urho Kekkosen katu 3 B, 5. krs",
            r"\burho kekkosen k\b\.": "Urho Kekkosen katu",
            r"\burho kekkonens gatan\b\.": "Urho Kekkosen katu",
            r"\bKampinkeskus, Urho Kekkosenkatu\b": "Kampinkeskus, Urho Kekkosen katu",
            r"\bKlondyketalo,Savio Kumitehtaankatu\b": "Klondyketalo Savio, Kumitehtaankatu",
            r"\bkauppakartanonkj\b\.": "Kauppakartanonkuja",
            r"\bhovioikeudenp\b\.": "Hovioikeudenpuistikko",
            r"\bemalitehtaankatu\b\s*\.": "Emalitehtaankatu",
            r"\bhammareninkatu\b\s*\.": "Hammareninkatu",
            r"\bjuomukkap\b\.": "Juomukkapolku",
            r"\bbodomv\b\.": "Bodomintie",
            r"\bKalkkitie 6 B As. A\b": "Kalkkitie 6 B",
            r"\bnämndemansv\b\.": "Lautamiehentie",
            r"\btopeliusespl\b\.": "Topeliuksenpuistikko",
            r"\bstrandnotsgr\b\.": "Rantanuotankuja",
            r"\blondbölev\b\.": "Londbölevägen",
            r"\bvästra härkmärov\b\.": "Läntinen härkmerentie",
            r"\bneptunigatan\b\.": "Neptunigatan",
            r"\bkauppap\b\.": "Kauppapuistikko",
            r"\bbusiness services kyrkoespl\b\.": "Business Services Oy Kirkkopuistikko",
            r"\bRevontie Ll Krs\b\.": "Revontie",
            r"\bleinikkikj\b\.": "Leinikkikuja",
            r"\berkkilänm\b\.": "Erkkilänmäentie",
            r"\bSkata-Mjödträsk V\.\b": "Skata-Mjödträskvägen",
            r"\bTainionkoskent\b": "Tainionkoskentie",
            r"\bH. Renlundinkatu\b": "Herman Renlundinkatu",
            r"\bV. Esplanadgatan\b": "Västra Esplanadgatan",
            r"\bV.Esplanadgatan\b": "Västra Esplanadgatan",
            r"\bMetsänneidonkuja, Trio, Ground Floor\b": "Metsänneidonkuja, Trio katutaso",
            r"\bHakalahdentie, Kuorma-Autoasennus Jm Oy\b": "Kuorma-Autoasennus Jm Oy, Hakalahdentie",
            r"\bVäinämöisentie 45 Liikenne O.Niemelä Oy\b": "Liikenne O.Niemelä Oy, Väinämöisentie 45",
            r"\bAs\.": "as.",
            r"as\.(?!\s)": "as. ",
            r"\bKalevank\.\b": "Kalevankatu",
            r"\bh\.(?!\s)": "Herman ",
            r"\bS\.(?!\s)": "Södra ",
            r"\bL\.(?!\s)": "Läntinen ",
            r"\bN\.(?!\s)": "Norra ",
            r"\bL\.\s": "Läntinen ",
        },
        **{
            r"(\w+)k\.": r"\1katu",
            r"(\w+)g\.": r"\1gatan",
            r"(\w+)t\.": r"\1tie",
            r"(\w+)v\.": r"\1vägen",
        },
    }

    # Apply replacements
    for pattern, replacement in replacements.items():
        street = re.sub(pattern, replacement, street, flags=re.IGNORECASE)

    # Ensure space between numbers and letters
    street = re.sub(r"(\d)([a-zA-Z])", r"\1 \2", street)
    street = re.sub(r"([a-zA-Z])(\d)", r"\1 \2", street)
    street = re.sub(r"(\d)\.([a-zA-Z])", r"\1. \2", street)

    # Match patterns like '5 Våning', '5. Våningen', or 'Våning 4'
    # and convert to '<number>. krs'
    street = re.sub(
        r"(\d+)\s*\.?\s*(Våning|Våningen)",  # Matches a number followed by 'Våning' or 'Våningen'
        r"\1. krs",  # Replaces it with '<number>. krs'
        street,
        flags=re.IGNORECASE,
    )

    # Handle patterns where 'Våning' comes first, like 'Våning 4'
    street = re.sub(
        r"\bVåning(en)?\s*(\d+)",  # Matches 'Våning' or 'Våningen' followed by a number
        r"\2. krs",  # Replaces it with '<number>. krs'
        street,
        flags=re.IGNORECASE,
    )

    # Replace 'Kerros' with 'krs' and ensure 'krs' is lowercase
    street = re.sub(r"\bKerros\b", "krs", street, flags=re.IGNORECASE)
    street = re.sub(r"\bkrs\b", "krs", street, flags=re.IGNORECASE)

    # Convert 'Ii' or 'LI' to '2.'
    street = re.sub(r"\b[Ii]{2}\b", "2.", street, flags=re.IGNORECASE)

    # Convert 'Iii' to '3.4'
    street = re.sub(r"\bIii\b", "3.", street, flags=re.IGNORECASE)

    # Add a dot after a number before 'krs'
    street = re.sub(r"(\d+)(\s*krs)", r"\1. \2", street, flags=re.IGNORECASE)

    # Add a comma after a word directly in front of a number followed by 'krs',
    # but ensure no duplicate commas
    street = re.sub(
        r"(\b\w+\b)(\s*)(\d+\.\s*krs)", r"\1, \3", street, flags=re.IGNORECASE
    )
    street = re.sub(r",\s*,", ",", street)  # Remove duplicate commas if any

    # Add a comma after 'Oy' if it is between words
    street = re.sub(r"\b(Oy)\b(?!,)(\s+\w+)", r"\1, \2", street, flags=re.IGNORECASE)

    # Ensure there is no dot after 'krs'
    street = re.sub(r"\bkrs\.", "krs", street, flags=re.IGNORECASE)
    # Remove extra spaces before commas
    street = re.sub(r"\s+,", ",", street)

    # Ensure there is exactly one space after each comma (if not already followed by whitespace)
    street = re.sub(r",\s*", ", ", street)

    return street


def split_co_and_street(street):
    """Split 'c/o' parts from the street and return them separately.

    Args:
        street (str): The street name to split.

    Returns:
        tuple: A tuple containing the 'c/o' part and the remaining street name.
    """
    # General case handling
    match = re.search(r"(c/o\s+[\w\s&/,]+)", street, flags=re.IGNORECASE)
    if match:
        co_part = match.group(1).strip()  # Extract `c/o` part
        street_part = (
            street.replace(co_part, "").strip(", ").strip()
        )  # Extract remaining address
        return co_part, street_part
    return None, street  # If no `c/o` is found, keep the address in the street column


def handle_special_addresses(street, co_value):
    """Handle special addresses that should stay in the street column.

    Args:
        street (str): The street name.
        co_value (str): The 'c/o' part.

    Returns:
        tuple: A tuple containing the updated street name and 'c/o' part.
    """
    special_addresses = [
        "almavägen",
        "talvikkitie",
        "sandhedsvägen",
        "poutuntie 17",
        "itämerenkatu",
        "ampumaradankatu 27",
        "pl 41",
        "winterinraitti 3 a 4",
        "pietarinpiistiiko",
        "koninkuja 1",
        "russnargatan 12",
        "paakarinpolku 1",
    ]

    if co_value and isinstance(co_value, str):
        co_value_lower = co_value.lower()
        for addr in special_addresses:
            if addr in co_value_lower:
                co_value = co_value_lower.replace(addr, "").strip(", ").strip()
                street = addr
                return street, co_value
    return street, co_value


def extract_co_parts(street, co_value):
    """Extract 'c/o' parts and move them to the 'co' column.

    Args:
        street (str): The street name.
        co_value (str): The existing 'c/o' part.

    Returns:
        tuple: A tuple containing the updated street name and 'c/o' part.
    """
    # Split 'c/o' parts from the street
    co_part, street = split_co_and_street(street)

    if co_part:
        co_value = f"{co_value}, {co_part}" if co_value else co_part

    # Handle special addresses
    street, co_value = handle_special_addresses(street, co_value)

    # Standardize 'kerros' and 'krs' to '{number}. krs' and move to 'co' column
    krs_match = re.search(r",\s*(\d+)\.\s*krs\b", street, re.IGNORECASE)
    if krs_match:
        krs_part = f"{krs_match.group(1)}. krs"
        co_value = f"{co_value}, {krs_part}" if co_value else krs_part
        street = re.sub(r",\s*(\d+)\.\s*krs\b", "", street, flags=re.IGNORECASE)

    return street, co_value


def move_to_co_and_clean(df):
    """Move parts of the street column after a comma.

    Args:
        df (pd.DataFrame): Input DataFrame containing 'street' and 'business_id' columns.

    Returns:
        pd.DataFrame: DataFrame with updated 'street' and 'co' columns.

    Raises:
        KeyError: If required columns are missing from the DataFrame.
    """
    if "street" not in df.columns or "business_id" not in df.columns:
        raise KeyError(
            "The input DataFrame must have 'street' and 'business_id' columns."
        )

    # Ensure the 'co' column exists
    if "co" not in df.columns:
        df["co"] = None

    # Keywords to move to the 'co' column if present after a comma
    keywords = [
        "Liikehuoneisto",
        "Työtila",
        "Lh",
        "B-Talo",
        "Katutaso",
        "Kirjais",
        "Sisäpiharakennus",
        "Tila",
        "Futura",
        "Bstie",
        "9 Vån",
        "Hiihtokeskus",
        "Asunto",
        "Liiketila",
        "Rautatieasema",
        "Cround Floor",
        "Boe",
        "Työtila",
        "Tila",
        "Innopoli 1",
        "Rak",
        "Rakatu",
        "Ovi",
    ]

    # Regex to match the keywords after a comma
    keyword_regex = r",\s*(" + "|".join(map(re.escape, keywords)) + r")\b.*"

    # Apply the Oy, moving and keyword processing
    df = df.apply(process_oy_and_keywords, axis=1, args=(keyword_regex,))

    # List of business_id values to remove
    ids_to_remove = [
        "0972912-1",
        "0779086-9",
        "2930322-4",
        "0782575-0",
        "0746373-7",
        "0424428-0",
        "0888376-8",
        "0231864-5",
        "0570335-4",
        "1008603-9",
        "0598382-7",
        "2329934-0",
        "0976713-6",
        "0947923-0",
        "0789260-3",
        "2872509-7",
        "0823814-4",
        "1732355-1",
    ]

    # Remove rows with these business_id values
    df = df[~df["business_id"].isin(ids_to_remove)]

    return df


def process_oy_and_keywords(row, keyword_regex):
    """Process a single row to move 'Oy,' parts and keyword-matched parts to the 'co' column.

    Args:
        row (pd.Series): A single row from the DataFrame.
        keyword_regex (str): Compiled regex pattern for matching keywords.

    Returns:
        pd.Series: Updated row with modified 'street' and 'co' values.
    """
    street = row["street"]
    co = row["co"]

    # Match and move Oy, parts, including the comma
    oy_match = re.match(r"^.*?\bOy,\s*", street, flags=re.IGNORECASE)
    if oy_match:
        oy_part = oy_match.group(0).strip()  # Extract matched Oy, part
        street = street.replace(oy_part, "").strip()  # Remove from street
        if co:
            co = f"{co}, {oy_part.strip(', ')}"
        else:
            co = oy_part.strip(", ")

    # Match and move keyword parts, including the comma
    keyword_match = re.search(keyword_regex, street, flags=re.IGNORECASE)
    if keyword_match:
        keyword_part = keyword_match.group(
            0
        ).strip()  # Extract matched keyword part, keeping comma
        street = street.replace(keyword_part, "").strip()  # Remove from street
        if co:
            co = f"{co}, {keyword_part.strip(', ')}"
        else:
            co = keyword_part.strip(", ")

    # Clean up extra spaces and commas in the modified street
    street = re.sub(r"\s+", " ", street).strip()
    street = re.sub(r",\s*$", "", street)  # Remove any trailing commas in the street

    row["street"] = street
    row["co"] = co
    return row


def add_comma_after_words(df, column, words):
    """Add a comma after specific words in the 'street' column.

    Args:
        df (pd.DataFrame): Input DataFrame.
        column (str): The column to process.
        words (list): List of words after which to add a comma.

    Returns:
        pd.DataFrame: DataFrame with updated column.

    Raises:
        KeyError: If the specified column is missing from the DataFrame.
    """
    if column not in df.columns:
        raise KeyError(f"The column '{column}' does not exist in the DataFrame.")

    # Match the words and check for absence of a comma immediately after
    word_regex = r"\b(" + "|".join(map(re.escape, words)) + r")\b(?!,)"

    # Apply the transformation
    df[column] = df[column].apply(
        lambda x: re.sub(word_regex, r"\1,", x) if isinstance(x, str) else x
    )
    return df


def remove_words_from_column(df, column, words_to_remove):
    """Remove specific unwanted words from the 'street' column.

    Args:
        df (pd.DataFrame): Input DataFrame.
        column (str): The column to process.
        words_to_remove (list): List of words to remove.

    Returns:
        pd.DataFrame: DataFrame with updated column.

    Raises:
        KeyError: If the specified column is missing from the DataFrame.
    """
    if column not in df.columns:
        raise KeyError(f"The column '{column}' does not exist in the DataFrame.")

    word_regex = r"\b(" + "|".join(map(re.escape, words_to_remove)) + r")\b"
    df[column] = df[column].apply(
        lambda x: re.sub(word_regex, "", x).strip() if isinstance(x, str) else x
    )
    return df


def normalize_and_extract_co(df):
    """Normalize street names and extract 'c/o' parts.

    Args:
        df (pd.DataFrame): The input DataFrame containing address data.

    Returns:
        pd.DataFrame: The DataFrame with normalized street names and extracted 'c/o' parts.
    """
    try:
        df["street"] = df["street"].apply(normalize_street)
        df["street"], df["co"] = zip(
            *df["street"].apply(lambda x: extract_co_parts(x, None))
        )
        df = move_to_co_and_clean(df)
        words_to_add_comma = [
            "Ania",
            "Ab",
            "Herkama",
            "Herman",
            "Hennalankatu",
            "Jukka",
            "Marjamäki",
            "Halkola",
            "Järvinen",
            "Kaasutehtaankatu 1",
            "Kauppakatu 13",
            "Finne",
            "Ky",
            "Kosonen Seppo",
            "Liuttu Eero",
            "Lyytikäinen Pekka",
            "M.Ekström",
            "Massby",
            "Matti Hellberg",
            "Mikael Hoxell",
            "Mäkelä Seppo",
            "Mågs",
            "P&N Heittola",
            "P.Lindell",
            "Romo",
            "Raivio Timo",
            "RakatuAnttila Antti Tuomi",
            "Suonenjoen KiintieKeskus",
            "Tekijänkuja",
            "Tiilikka",
            "Rimpineva",
            "Tilitoimisto M. Hauhtonen",
            "Uskatu Mies Markku Tiainen",
            "Annti",
            "Vt Veli Pekka Huotari",
            "Wallininkuja",
        ]
        # List of words to remove
        words_to_remove = ["Bstie", "LI krs", "Bostie 1", "Lt 1", "Toim. 2"]

        # Add a comma after specific words in the 'street' column
        df = add_comma_after_words(df, "street", words_to_add_comma)

        # Remove specific unwanted words from the 'street' column
        df = remove_words_from_column(df, "street", words_to_remove)

    except Exception as e:
        print(f"Error normalizing or extracting 'c/o' or moving oy parts: {e}")
    return df
