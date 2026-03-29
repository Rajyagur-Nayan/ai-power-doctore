import os

file_path = r"c:\project folder\medical\frontend\components\DoctorList.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("healthcare-900", "primary-900")
content = content.replace("healthcare-500", "medical-textSecondary")
content = content.replace("healthcare-400", "primary-400")
content = content.replace("healthcare-200", "primary-200")
content = content.replace("healthcare-50", "primary-50")
content = content.replace("brand-blue", "primary-600")
content = content.replace("brand-green", "medical-green")
content = content.replace('className="rounded-2xl"', 'className="rounded-full"')
content = content.replace('shadow-md', 'shadow-sm')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done DoctorList")
