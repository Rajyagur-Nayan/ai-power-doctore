import os

files = [
    r"c:\project folder\medical\frontend\components\layout\Layout.tsx",
    r"c:\project folder\medical\frontend\components\layout\Sidebar.tsx",
    r"c:\project folder\medical\frontend\components\layout\MobileBottomNav.tsx",
    r"c:\project folder\medical\frontend\components\layout\MobileHeader.tsx"
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Apply same typographic cleaning
    content = content.replace("font-black", "font-semibold")
    content = content.replace("text-[8px]", "text-xs")
    content = content.replace("text-[9px]", "text-xs")
    content = content.replace("text-[10px]", "text-sm")
    content = content.replace("text-[11px]", "text-sm")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Refactored layouts")
