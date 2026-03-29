import re

file_path = r"c:\project folder\medical\frontend\app\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace excessive heavy styling
content = content.replace("font-black", "font-semibold")
content = content.replace("italic", "")
content = content.replace("tracking-tighter", "tracking-tight")
content = content.replace("tracking-[0.3em]", "tracking-widest")
content = content.replace("tracking-[0.2em]", "tracking-wider")
content = content.replace("text-[8px]", "text-xs")
content = content.replace("text-[9px]", "text-xs")
content = content.replace("text-[10px]", "text-sm")
content = content.replace("text-[11px]", "text-sm")
content = content.replace("uppercase", "") # sometimes we might want to keep, let's see. Let's just remove italic and font-black first

# Custom replacements
content = content.replace(
    'bg-primary-600 border-none p-10 rounded-[3rem] shadow-2xl',
    'bg-gradient-to-br from-primary-400 to-primary-500 border-none p-8 rounded-3xl shadow-lg'
)
content = content.replace(
    'rounded-[3rem]', 'rounded-3xl'
)
content = content.replace(
    'rounded-[2rem]', 'rounded-2xl'
)
content = content.replace(
    'bg-medical-textPrimary text-white',
    'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated page.tsx")
