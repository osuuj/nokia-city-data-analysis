class Mappings:
    """
    A class to handle various mappings for company data.
    """

    # Mappings with all keys as strings
    NAME_TYPE_MAPPING = {
        "1": "Business Name (Sole Trader)",
        "2": "Parallel Company Name",
        "3": "Auxiliary Business Name",
        "4": "Translation of Auxiliary Business Name",
    }

    COMPANY_FORM_TYPE_MAPPING = {
        "2" : "Housing company",
        "3" : "Resident-administered area",
        "4" : "Right-of-occupancy association",
        "5" : "Partnership",
        "6" : "Non-profit association",
        "7" : "Finnish branch of a European economic interest grouping",
        "8" : "European economic interest grouping",
        "83" : "European co-operative society",
        "84" : "European co-operative bank",
        "9" : "Mortgage society",
        "10" : "Limited liability joint-stock property company",
        "11" : "Public mutual insurance company",
        "12" : "Mutual insurance company",
        "13" : "Limited partnership",
        "14" : "Co-operative",
        "15" : "Co-operative bank",
        "16" : "Limited company",
        "17" : "Public limited company",
        "80" : "European company",
        "19" : "Branch of a foreign trader",
        "20" : "Savings bank",
        "18" : "Foundation",
        "21" : "Association for carrying on economic activity",
        "23" : "Public limited insurance company",
        "24" : "Limited insurance company",
        "25" : "Insurance association",
        "22" : "State-owned company",
    }

    STATUS_MAPPING = {
        "1": "Pending",
        "2": "Active",
        "3": "Business ID Deactivated",
        "unknown": "Unknown",
    }

    AUTHORITY_MAPPING = {
        "1": "Tax Administration",
        "2": "Patent and Registration Office",
        "3": "Population Register Center",
    }

    REGISTER_MAPPING = {
        "1": "Trade Register",
        "2": "Foundation Register",
        "3": "Association Register",
        "4": "Basic Information from the Tax Administration",
        "5": "Prepayment Register",
        "6": "Value-Added Tax Liability",
        "7": "Employer Register",
        "8": "Insurance Premium Tax Liability Register",
    }

    ADDRESS_TYPE_MAPPING = {
        "1": "Postal Address",
        "2": "Visiting Address",
    }

    @staticmethod
    def map_generic(mapping_dict, value, default="Unknown") -> str:
        """
        Generic method to map a value using a provided mapping dictionary.

        Args:
            mapping_dict (dict): The dictionary containing the mapping.
            value: The value to map.
            default (str): The default value to return if mapping fails.

        Returns:
            str: The mapped value or the default value if not found.
        """
        value = str(value).strip().lower() if value is not None else "unknown"
        return mapping_dict.get(value, default)

    @staticmethod
    def map_name_type(value) -> str:
        """Map name type using NAME_TYPE_MAPPING."""
        return Mappings.map_generic(Mappings.NAME_TYPE_MAPPING, value)

    @staticmethod
    def map_company_form_type(value) -> str:
        """Map company form type using COMPANY_FORM_TYPE_MAPPING."""
        return Mappings.map_generic(Mappings.COMPANY_FORM_TYPE_MAPPING, value)

    @staticmethod
    def map_status(value) -> str:
        """Map status using STATUS_MAPPING."""
        return Mappings.map_generic(Mappings.STATUS_MAPPING, value)

    @staticmethod
    def map_authority(value) -> str:
        """Map authority using AUTHORITY_MAPPING."""
        return Mappings.map_generic(Mappings.AUTHORITY_MAPPING, value)

    @staticmethod
    def map_register(value) -> str:
        """Map register using REGISTER_MAPPING."""
        return Mappings.map_generic(Mappings.REGISTER_MAPPING, value)

    @staticmethod
    def map_address_type(value) -> str:
        """Map address type using ADDRESS_TYPE_MAPPING."""
        return Mappings.map_generic(Mappings.ADDRESS_TYPE_MAPPING, value)
