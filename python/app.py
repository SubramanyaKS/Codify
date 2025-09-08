from flask import Flask, jsonify, send_file
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS
import logging
import os
import google.generativeai as genai
import dotenv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io

dotenv.load_dotenv()
def create_pdf(summary_text, video_id):
    # Create PDF in memory using BytesIO
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Add a title
    story.append(Paragraph("Video Summary Notes", styles['Title']))
    story.append(Spacer(1, 20))

    # Split summary into paragraphs/bullets
    for line in summary_text.split("\n"):
        if line.strip():
            story.append(Paragraph(line.strip(), styles['Normal']))
            story.append(Spacer(1, 10))

    doc.build(story)
    buffer.seek(0)
    return buffer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model=genai.GenerativeModel("gemini-2.0-flash")

def summarize_transcript(tscript_text):
    prompt = f"""
    You are a note-making assistant.
    Here is a transcript of a YouTube video:
    {tscript_text}

    Summarize the transcript into clear, structured notes with headings, numbered points and key takeaways.
    And Just give me the Summary no extra text.
    """
    
    response = model.generate_content(prompt)
    return response.text

@app.route('/transcript/<video_id>', methods=['GET'])
def get_transcript_summary(video_id):
    try:
        logger.info(f"Fetching transcript for video ID: {video_id}")
        
        # Fetch the transcript
        ytt_api = YouTubeTranscriptApi()
        fetch_transcript_list = ytt_api.list(video_id)
        fetched_transcript = fetch_transcript_list.find_transcript(language_codes=['en', 'hi'])
        transcript = fetched_transcript.fetch()
       # Extract text from transcript
        transcript_text = " ".join([entry.text for entry in transcript])
        
        logger.info(f"Successfully fetched transcript. Length: {len(transcript_text)} characters")
        summary = summarize_transcript(transcript_text)
        pdf_buffer = create_pdf(summary, video_id)
        
        return send_file(
            pdf_buffer, 
            as_attachment=True, 
            download_name=f"{video_id}_summary.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        logger.error(f"Error fetching transcript for {video_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'video_id': video_id
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'transcript-api'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)