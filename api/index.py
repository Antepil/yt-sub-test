from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import re
from typing import Optional, List

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SubtitleRequest(BaseModel):
    url: str
    lang: Optional[str] = 'en'

def extract_video_id(url: str) -> Optional[str]:
    """
    Extracts the video ID from a YouTube URL.
    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    """
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    return None

def format_timestamp(seconds: float) -> str:
    """Converts seconds to SRT timestamp format (HH:MM:SS,mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"

def generate_srt(transcript: List[dict]) -> str:
    """Generates SRT content from transcript list."""
    srt_content = ""
    for i, entry in enumerate(transcript, 1):
        start = entry['start']
        duration = entry['duration']
        end = start + duration
        text = entry['text']
        
        srt_content += f"{i}\n"
        srt_content += f"{format_timestamp(start)} --> {format_timestamp(end)}\n"
        srt_content += f"{text}\n\n"
    return srt_content

@app.post("/api/extract")
async def extract_subtitles(request: SubtitleRequest):
    video_id = extract_video_id(request.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    try:
        # Try to fetch transcript
        # We try to list transcripts first to find available languages if needed,
        # but for simplicity, we'll try to get the requested language or auto-generated one.
        
        # 'list' is better as it handles auto-generated ones well
        # Note: In version 1.x+, YouTubeTranscriptApi is a class that needs instantiation
        yt = YouTubeTranscriptApi()
        transcript_list = yt.list(video_id)
        
        # Priority: Manual Requested -> Manual English -> Auto Requested -> Auto English
        try:
            # Try finding manually created transcript in requested language
            transcript = transcript_list.find_manually_created_transcript([request.lang, 'en'])
        except:
            try:
                # Fallback to generated transcript
                transcript = transcript_list.find_generated_transcript([request.lang, 'en'])
            except:
                 # If specific lang not found, take the first available one
                transcript = next(iter(transcript_list))

        fetched_transcript = transcript.fetch()
        # Convert to list of dicts for compatibility
        data = fetched_transcript.to_raw_data()
        
        # Generate formats
        srt_content = generate_srt(data)
        txt_content = "\n".join([item['text'] for item in data])
        
        return {
            "video_id": video_id,
            "language": transcript.language,
            "language_code": transcript.language_code,
            "is_generated": transcript.is_generated,
            "subtitles": data,
            "srt": srt_content,
            "txt": txt_content
        }

    except (TranscriptsDisabled, NoTranscriptFound):
        raise HTTPException(status_code=404, detail="No subtitles found for this video. Please ensure the video has CC enabled.")
    except Exception as e:
        import traceback
        print(f"Error processing video {video_id}:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
