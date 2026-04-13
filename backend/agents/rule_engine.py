class RuleEngine:
    def __init__(self, rules_path=None):
        pass

    def evaluate_prior_auth(self, icd10_codes, cpt_codes):
        return {
            "status": "Approved",
            "reasons": ["Standard procedure (mocked)"]
        }
