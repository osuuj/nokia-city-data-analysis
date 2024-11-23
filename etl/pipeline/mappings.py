class Mappings:
    @staticmethod
    def map_name_type(type_number: int) -> str:
        return {
            1: "Business Name (Sole Trader)",
            2: "Parallel Company Name",
            3: "Auxiliary Business Name",
            4: "Translation of Auxiliary Business Name",
        }.get(type_number, "Unknown")

    @staticmethod
    def map_company_form_type(type_number: int) -> str:
        return {
            13: "Limited partnership",
            16: "Limited company",
            # Add other mappings as needed
        }.get(type_number, "Unknown")

    @staticmethod
    def map_status(status_number: int) -> str:
        return {
            1: "Pending",
            2: "Active",
            3: "Business ID Deactivated",
        }.get(status_number, "Unknown")

    @staticmethod
    def map_authority(authority_number: int) -> str:
        return {
            1: "Tax Administration",
            2: "Patent and Registration Office",
            3: "Population Register Center",
        }.get(authority_number, "Unknown")

    @staticmethod
    def map_register(register_number: int) -> str:
        return {
            1: "Trade Register",
            2: "Foundation Register",
            3: "Association Register",
            4: "Basic Information from the Tax Administration",
            5: "Prepayment Register",
            6: "Value-Added Tax Liability",
            7: "Employer Register",
            8: "Insurance Premium Tax Liability Register",
        }.get(register_number, "Unknown")

    @staticmethod
    def map_address_type(type_number: int) -> str:
        return {
            1: "Postal Address",
            2: "Visiting Address",
        }.get(type_number, "Unknown")
