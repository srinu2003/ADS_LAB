import win32com.client
import os

def extract_record():
    doc_path = r"c:\Users\tsiri\Projects\ADS_LAB\lab record.doc"
    abs_path = os.path.abspath(doc_path)
    output_path = r"c:\Users\tsiri\Projects\ADS_LAB\lab_record_clean.md"
    
    print(f"Opening: {abs_path}")
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    try:
        doc = word.Documents.Open(abs_path)
        
        paragraphs = []
        for para in doc.Paragraphs:
            paragraphs.append(para.Range.Text.strip())
            
        doc.Close()
        
        # State machine parsing
        state = "NORMAL"
        clean_lines = []
        
        for p in paragraphs:
            p_upper = p.upper()
            p_lower = p.lower()
            
            # Check for header transitions
            if p_upper.startswith("EXPERIMENT-") or p in ("Additional Experiment", "MICRO PROJECT"):
                state = "NORMAL"
            elif p_lower.startswith("conclusion:"):
                state = "NORMAL"
            elif p_lower.startswith("input:"):
                state = "NORMAL"
            elif p_lower.startswith("program:"):
                state = "PROGRAM_HEADER"
            elif p_upper.startswith("OUTPUT:") or p_upper.startswith("OUTPUT-") or p_upper == "OUTPUT":
                state = "OUTPUT_HEADER"
                
            # Depending on state, decide if we write the line
            if state == "NORMAL":
                clean_lines.append(p)
            elif state == "PROGRAM_HEADER":
                # If we encounter code starter keywords, change state to CODE and skip
                if p.startswith("def ") or p.startswith("import ") or p.startswith("from "):
                    state = "CODE"
                else:
                    # Write title/description before code block
                    clean_lines.append(p)
            elif state == "CODE":
                # Skipping code
                pass
            elif state == "OUTPUT_HEADER":
                clean_lines.append(p)
                state = "OUTPUT"
            elif state == "OUTPUT":
                # Skipping output details
                pass
                
        # Format markdown cleanly
        md_content = []
        for line in clean_lines:
            if not line:
                if md_content and md_content[-1] != "":
                    md_content.append("")
                continue
            
            # Formatting headings nicely
            if line.upper().startswith("EXPERIMENT-") or line in ("Additional Experiment", "MICRO PROJECT"):
                md_content.append(f"\n## {line}\n")
            elif line.startswith("AIM:") or line.startswith("Description:") or line.startswith("Program:") or line.startswith("INPUT:") or line.startswith("OUTPUT:") or line.startswith("OUTPUT-") or line.startswith("Conclusion:"):
                md_content.append(f"**{line}**")
            else:
                md_content.append(line)
                
        # Join and write to file
        final_text = "\n".join(md_content).strip()
        # Replace multiple consecutive blank lines with single one
        while "\n\n\n" in final_text:
            final_text = final_text.replace("\n\n\n", "\n\n")
            
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(final_text + "\n")
            
        print(f"Successfully extracted clean record to: {output_path}")
        
    except Exception as e:
        print("Error during extraction:", e)
    finally:
        word.Quit()

if __name__ == '__main__':
    extract_record()
