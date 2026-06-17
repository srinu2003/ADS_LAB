import win32com.client
import os
import glob

def convert_docx_to_pdf():
    outputs_dir = r"c:\Users\tsiri\Projects\ADS_LAB\outputs"
    search_path = os.path.join(outputs_dir, "ADS LAB RECORD *.docx")
    docx_files = glob.glob(search_path)
    
    if not docx_files:
        print("No student docx files found in outputs/ directory.")
        return
        
    print(f"Found {len(docx_files)} files to convert.")
    
    # Initialize Word
    print("Launching Microsoft Word...")
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    
    try:
        for docx_path in docx_files:
            abs_docx = os.path.abspath(docx_path)
            abs_pdf = abs_docx.replace(".docx", ".pdf")
            
            print(f"Converting: {os.path.basename(abs_docx)} -> {os.path.basename(abs_pdf)}")
            
            # Close it first if it happens to be open in Word (resilience)
            for doc in word.Documents:
                if doc.FullName.lower() == abs_docx.lower():
                    doc.Close(False)
                    
            doc = word.Documents.Open(abs_docx)
            # 17 represents wdFormatPDF
            doc.SaveAs2(abs_pdf, FileFormat=17)
            doc.Close()
            print("Converted successfully.")
            
        print("All documents successfully converted to PDF!")
        
    except Exception as e:
        print("Error during conversion:", e)
    finally:
        word.Quit()

if __name__ == '__main__':
    convert_docx_to_pdf()
