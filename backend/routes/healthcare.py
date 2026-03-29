from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os

# Import agents
from agents.nlp_agent import NLPAgent
from agents.coding_agent import CodingAgent
from agents.rule_engine.py as rule_engine_mod # Wait, I can't import .py file directly like that
from agents.rule_engine import RuleEngine
from agents.claims_agent import ClaimsAgent
from agents.audit_logger import audit_logger

router = APIRouter(prefix="/healthcare", tags=["Healthcare Ops"])

class CaseRequest(BaseModel):
    notes: str

# Initialize agents
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

nlp = NLPAgent()
coder = CodingAgent(
    icd10_path=os.path.join(DATA_DIR, "icd10.json"),
    cpt_path=os.path.join(DATA_DIR, "cpt.json")
)
rules = RuleEngine(rules_path=os.path.join(DATA_DIR, "payer_rules.json"))
claims = ClaimsAgent()

@router.post("/process-case")
async def process_case(request: CaseRequest):
    """
    Main pipeline for healthcare case processing.
    """
    try:
        # 1. NLP Extraction
        entities = nlp.extract_entities(request.notes)
        audit_logger.log(
            "NLP", 
            request.notes, 
            entities, 
            "Extract clinical entities from text", 
            "Used Groq Llama-3 70B with local fallback"
        )
        
        # 2. Coding Mapping
        icd10_codes = coder.map_diagnoses(entities.get("suspected_diagnoses", []) + entities.get("symptoms", []))
        cpt_codes = coder.map_procedures(entities.get("requested_procedures", []))
        
        audit_logger.log(
            "Coding", 
            entities, 
            {"icd10": icd10_codes, "cpt": cpt_codes}, 
            "Map entities to ICD-10 and CPT codes", 
            "Fuzzy matching against curated local datasets"
        )
        
        # 3. Rule Engine (Prior Auth)
        decision = rules.evaluate_prior_auth(icd10_codes, cpt_codes)
        audit_logger.log(
            "RuleEngine", 
            {"icd10": [c["code"] for c in icd10_codes], "cpt": [c["code"] for c in cpt_codes]}, 
            decision, 
            "Evaluate medical necessity and prior auth", 
            "Deterministic rule matching"
        )
        
        # 4. Claims Adjudication
        billing = claims.adjudicate(cpt_codes, decision)
        audit_logger.log(
            "Claims", 
            {"cpt": cpt_codes, "decision": decision}, 
            billing, 
            "Calculate insurance share and patient payable", 
            "Adjudication based on coverage rules"
        )
        
        # 5. Final Response
        response = {
            "extracted": entities,
            "codes": {
                "icd10": icd10_codes,
                "cpt": cpt_codes
            },
            "decision": {
                "status": decision["status"],
                "reason": "; ".join(decision["reasons"]) if decision["reasons"] else "Criteria met."
            },
            "billing": billing,
            "audit_trail": audit_logger.get_trail()
        }
        
        return response
    except Exception as e:
        print(f"Pipeline Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
