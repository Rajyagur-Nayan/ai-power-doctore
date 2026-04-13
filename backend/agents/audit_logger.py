class AuditLogger:
    def __init__(self):
        self.trail = []

    def log(self, stage, input_data, output_data, description, method):
        self.trail.append({
            "stage": stage,
            "input": input_data,
            "output": output_data,
            "description": description,
            "method": method
        })

    def get_trail(self):
        return self.trail
        
audit_logger = AuditLogger()
