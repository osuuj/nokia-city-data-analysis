class Mappings:
    """A class to handle various mappings for company data."""

    NAME_TYPE_MAPPING = {
        1: "Business Name (Sole Trader)",
        2: "Parallel Company Name",
        3: "Auxiliary Business Name",
        4: "Translation of Auxiliary Business Name",
    }

    COMPANY_FORM_TYPE_MAPPING = {
        13: "Limited partnership",
        16: "Limited company",
        # Add other mappings as needed
    }

    STATUS_MAPPING = {
        1: "Pending",
        2: "Active",
        3: "Business ID Deactivated",
    }

    AUTHORITY_MAPPING = {
        1: "Tax Administration",
        2: "Patent and Registration Office",
        3: "Population Register Center",
    }

    REGISTER_MAPPING = {
        1: "Trade Register",
        2: "Foundation Register",
        3: "Association Register",
        4: "Basic Information from the Tax Administration",
        5: "Prepayment Register",
        6: "Value-Added Tax Liability",
        7: "Employer Register",
        8: "Insurance Premium Tax Liability Register",
    }

    ADDRESS_TYPE_MAPPING = {
        1: "Postal Address",
        2: "Visiting Address",
    }

    @staticmethod
    def map_name_type(type_number: int) -> str:
        """Map name type number to its corresponding string."""
        return Mappings.NAME_TYPE_MAPPING.get(type_number, "Unknown")

    @staticmethod
    def map_company_form_type(type_number: int) -> str:
        """Map company form type number to its corresponding string."""
        return Mappings.COMPANY_FORM_TYPE_MAPPING.get(type_number, "Unknown")

    @staticmethod
    def map_status(status_number: int) -> str:
        """Map status number to its corresponding string."""
        return Mappings.STATUS_MAPPING.get(status_number, "Unknown")

    @staticmethod
    def map_authority(authority_number: int) -> str:
        """Map authority number to its corresponding string."""
        return Mappings.AUTHORITY_MAPPING.get(authority_number, "Unknown")

    @staticmethod
    def map_register(register_number: int) -> str:
        """Map register number to its corresponding string."""
        return Mappings.REGISTER_MAPPING.get(register_number, "Unknown")

    @staticmethod
    def map_address_type(type_number: int) -> str:
        """Map address type number to its corresponding string."""
        return Mappings.ADDRESS_TYPE_MAPPING.get(type_number, "Unknown")
