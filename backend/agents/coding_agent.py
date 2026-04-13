class CodingAgent:
    def __init__(self, icd10_path=None, cpt_path=None):
        pass

    def map_diagnoses(self, entities):
        return [{"code": "R50.9", "description": "Fever, unspecified (mocked)"}]

    def map_procedures(self, entities):
        return [{"code": "99213", "description": "Outpatient visit (mocked)"}]
