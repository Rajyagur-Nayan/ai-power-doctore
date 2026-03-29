import os

files = [
    r"c:\project folder\medical\frontend\app\page.tsx",
    r"c:\project folder\medical\frontend\components\layout\Sidebar.tsx",
    r"c:\project folder\medical\frontend\components\DoctorDashboard.tsx",
    r"c:\project folder\medical\frontend\components\History.tsx",
    r"c:\project folder\medical\frontend\components\DoctorList.tsx",
    r"c:\project folder\medical\frontend\components\ChatUI.tsx",
    r"c:\project folder\medical\frontend\components\VoiceAssistant.tsx",
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Clean up excessive weight and typography
    content = content.replace("font-black", "font-semibold")
    content = content.replace("italic", "")
    content = content.replace("tracking-tighter", "tracking-tight")
    
    # 2. Modernize font sizes on micro-text
    content = content.replace("text-[8px]", "text-xs")
    content = content.replace("text-[9px]", "text-xs")
    content = content.replace("text-[10px]", "text-sm")
    content = content.replace("text-[11px]", "text-sm")
    
    # 3. Simplify excessive borders and radiuses
    content = content.replace("rounded-[4rem]", "rounded-3xl")
    content = content.replace("rounded-[3.5rem]", "rounded-3xl")
    content = content.replace("rounded-[3rem]", "rounded-3xl")
    content = content.replace("rounded-[2.5rem]", "rounded-2xl")
    content = content.replace("rounded-[2rem]", "rounded-2xl")
    
    # 4. Swap dark minimal/emergency styling to soft green aesthetic
    content = content.replace("bg-medical-textPrimary", "bg-primary-600")
    content = content.replace("bg-black", "bg-primary-600")
    content = content.replace("text-black", "text-primary-900")
    
    # 5. Fix any broken shadow strings resulting from the above
    content = content.replace("shadow-2xl", "shadow-lg")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Refactored UI classes successfully.")
