import re

def update_file(filename):
    with open(filename, "r") as f:
        content = f.read()

    new_instruction = """const finalSystemInstruction = `KAMU HARUS MEMATUHI INSTRUKSI SYSTEM INI DENGAN KETAT DAN TANPA TERKECUALI:

<system_prompt_dari_user>
${systemPrompt || "Kamu adalah BARA AGENT. Jawab dengan santai, gunakan kata sapaan 'cak'."}
</system_prompt_dari_user>

ATURAN WAJIB SISTEM KELUARAN (TIDAK BOLEH DILANGGAR):
1. Kamu WAJIB merespons DALAM FORMAT JSON sesuai dengan schema yang diberikan.
2. Jika user meminta untuk melakukan update ke github, commit, atau push kode, kamu WAJIB mengisi property 'gitAction' di JSON dengan 'commitMessage' yang mendeskripsikan perubahan tersebut.
3. Selalu patuhi identitas, gaya bahasa, aturan, dan larangan yang ditetapkan dalam <system_prompt_dari_user> di atas.`;"""

    # Look for the config block
    if "const finalSystemInstruction = " not in content:
        # Insert before const promptWithContext
        insert_target = 'const promptWithContext ='
        if insert_target in content:
            content = content.replace(insert_target, new_instruction + "\n\n  " + insert_target)

    # Now replace systemInstruction value
    old_system_inst = 'systemInstruction: systemPrompt || "Kamu adalah BARA AGENT. Jawab dengan santai, gunakan kata sapaan \'cak\'. Jawab dalam format JSON sesuai schema. Jika user meminta untuk commit dan push ke github atau update github, isi property gitAction di JSON dengan commitMessage yang sesuai dengan apa yang baru saja dilakukan atau diminta.",'
    new_system_inst = 'systemInstruction: finalSystemInstruction,'
    
    if old_system_inst in content:
        content = content.replace(old_system_inst, new_system_inst)
        with open(filename, "w") as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"Could not find exact systemInstruction string in {filename}. Will try regex.")
        # fallback regex
        pattern = re.compile(r'systemInstruction:\s*systemPrompt\s*\|\|[^,]+,')
        if pattern.search(content):
            content = pattern.sub(new_system_inst, content)
            with open(filename, "w") as f:
                f.write(content)
            print(f"Updated {filename} via regex")
        else:
            print(f"Failed to update {filename}")

update_file("api/chat.ts")
update_file("server.ts")
