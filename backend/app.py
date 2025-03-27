import fitz  # PyMuPDF
import json
import google.generativeai as genai  # Google Gemini API
import os
import tempfile
from dotenv import load_dotenv
from flask import Flask, request, jsonify
# Load environment variables
load_dotenv()

from flask_cors import CORS  # Add this import at the top

# Right after creating your Flask app, add:
app = Flask(__name__)
CORS(app)
# Configure Google Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
# Initialize Flask app
app = Flask(__name__)
# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = "\n".join([page.get_text() for page in doc])
        return text
    except Exception as e:
        raise ValueError(f"Error extracting text from PDF: {e}")
# Function to generate JSON from text using Gemini
def generate_json_from_text(text):
    structuring_prompt = f"""
    Extract structured data from the following document text and format it as a JSON:
    {text}
    Ensure that:
    - The JSON follows a logical hierarchy.
    - Important sections like "Project Details", "Technical Specifications", and "Regulations" are included.
    - The JSON structure should be as follows:
      {{
        "project": {{
          "name": "Project Name",
          "address": "Project Address",
          "contact": {{
            "phone": "Installer Phone",
            "email": "Installer Email"
          }},
          "system_info": {{
            "installer": "Installer Name",
            "date": "Project Date",
            "dc_system_size_kwdc": DC System Size in KWDC,
            "ac_system_size_kwac": AC System Size in KWAC,
            "esi_id": "ESI ID",
            "meter_number": "Meter Number",
            "nabcep_badge": "NABCEP Badge"
          }}
        }}
      }}
    Return only valid JSON. Do not add any extra text before or after the JSON.
    """
    model = genai.GenerativeModel('gemini-1.5-pro-002')
    response = model.generate_content(
        structuring_prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.1,
            response_mime_type="application/json"
        )
    )
    try:
        structured_json = json.loads(response.text)  # Convert response to JSON dict
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from Gemini response: {e}")
        print(f"Response text: {response.text}")
        return {"error": "Failed to parse JSON from Gemini response"}
    # Modify Certain Values Using Gemini
    modification_prompt = f"""
    Modify the following JSON by making the following changes:
    - Change "project > system_info > date" to "01/04/2025".
    - Update "project > system_info > dc_system_size_kwdc" by increasing it by 10%.
    Return only the modified JSON.
    JSON:
    {json.dumps(structured_json, indent=2)}
    """
    response_modified = model.generate_content(
        modification_prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.1,
            response_mime_type="application/json"
        )
    )
    try:
        modified_json = json.loads(response_modified.text)  # Convert modified JSON
    except json.JSONDecodeError as e:
        print(f"Error parsing modified JSON from Gemini response: {e}")
        print(f"Response text: {response_modified.text}")
        return {"error": "Failed to parse modified JSON from Gemini response"}
    return modified_json
# Function to validate PDF details against JSON using Gemini
def validate_pdf_with_gemini(pdf_text, json_data):
    prompt = f"""
    You are an AI assistant validating details extracted from a PDF against a correct JSON file.
    Identify any incorrect information present in the PDF.
    Here is the correct JSON data:
    {json.dumps(json_data, indent=2)}
    Here is the extracted text from the PDF:
    {pdf_text}
    Compare both and return:
    1. Any incorrect or mismatched details in the PDF.
    2. What the correct value should be (from JSON).
    3. A structured JSON validation report highlighting discrepancies.
    Return a structured JSON response with each field having:
    - "field": The key name in JSON.
    - "pdf_value": The value found in the PDF.
    - "json_value": The correct value from JSON.
    - "valid": true if they match, false if they are different.
    Note:
    - Ignore case sensitivity (e.g., "PARKER ST" should match "Parker St").
    - Ignore minor formatting differences such as commas, periods, and line breaks.
    - Focus on the core content of the text for validation.
    - Ensure that every field in the JSON is validated.
    Provide the response in a structured JSON format.
    """
    model = genai.GenerativeModel('gemini-1.5-pro-002')
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.1,
            response_mime_type="application/json"
        )
    )
    return response.text  # Gemini returns a structured validation report
# Route to handle PDF and JSON validation
@app.route('/validate', methods=['POST'])
def validate():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "PDF file is required"}), 400
    pdf_file = request.files['pdf_file']
    try:
        # Create a temporary directory
        with tempfile.TemporaryDirectory() as tmpdirname:
            pdf_path = os.path.join(tmpdirname, pdf_file.filename)
            pdf_file.save(pdf_path)
            pdf_text = extract_text_from_pdf(pdf_path)
            json_data = generate_json_from_text(pdf_text)
            validation_result = validate_pdf_with_gemini(pdf_text, json_data)
        return jsonify({
            "generated_json": json_data,
            "validation_result": json.loads(validation_result)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)









