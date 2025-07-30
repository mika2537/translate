from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse
from enum import Enum

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.1.107:3000/"],  # Or React dev server's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Language(str, Enum):
    mongolian = 'Mongolian'
    english = 'English'

@app.options("/analyze")
async def options_analyze(request: Request):
    return JSONResponse(status_code=200)
@app.post("/analyze")
async def analyze(
    source_lang: Language = Form(...),
    target_lang: Language = Form(...),
    file: UploadFile = File(None),
    url: str = Form(None),
):
    if not file and not url:
        raise HTTPException(status_code=400, detail='You must provide either a file or a URL.')

    # Dummy response for now
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("back:app", host="0.0.0.0", port=8002, reload=True)
# ---- other logic (commented out) ----
# from pyannote.audio import Pipeline
# import torch, librosa, soundfile as sf, subprocess

# def segment_audio_vad(...):
#     ...

# uvicorn main:app --host 0.0.0.0 --port 8001 --reload






# ==========================


# from fastapi import FastAPI, Request, UploadFile , File, Form, HTTPException
# from pydantic import BaseModel # not use 
# from enum import Enum
# from yt_dlp import YoutubeDL
# from tqdm import tqdm


# from fastapi.responses import HTMLResponse
# from fastapi.templating import Jinja2Templates

# from dotenv import load_dotenv
# import os

# load_dotenv()
# hf_token = os.environ.get("HF_TOKEN")



# app = FastAPI() 


# templates = Jinja2Templates(directory='templates')

# @app.get('/', response_class=HTMLResponse)
# def read_root(request: Request):
#     return templates.TemplateResponse('index.html', {'request': request})




# # import torch
# # from transformers import AutoProcessor, AutoModelForImageTextToText

# # class GemmaHandler:
# #     def __init__(self, model_id="google/gemma-3n-E2B-it", force_device=None):

# #         if force_device:
# #             self.device = torch.device(force_device)
# #         else:
# #             self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
# #         print(f"GEMMA model loaded on: {self.device}")

# #         self.processor = AutoProcessor.from_pretrained(model_id)
# #         self.model = AutoModelForImageTextToText.from_pretrained(model_id)
# #         self.model.eval()

# #     def transcribe_audio(self, audio_path, prompt="Transcribe this audio."):
# #         messages = [
# #             {
# #                 "role": "user",
# #                 "content": [
# #                     {"type": "audio", "audio": audio_path},
# #                     {"type": "text", "text": prompt},
# #                 ]
# #             }
# #         ]

# #         input_ids = self.processor.apply_chat_template(
# #             messages,
# #             add_generation_prompt=True,
# #             tokenize=True,
# #             return_dict=True,
# #             return_tensors="pt"
# #         ).to(self.device)

# #         outputs = self.model.generate(**input_ids, max_new_tokens=1024)

# #         result = self.processor.batch_decode(
# #             outputs,
# #             skip_special_tokens=True,
# #             clean_up_tokenization_spaces=True
# #         )
# #         return result[0]

# # gemma = GemmaHandler()



# from pyannote.audio import Pipeline
# import torch
# import os
# import librosa
# import soundfile as sf

# def segment_audio_vad(audio_path: str, output_dir: str, hf_token: str) -> list:
#     """
#     WAV файл дээр VAD хийж, яриа агуулсан сегментүүдийг тасдаж WAV хэлбэрээр хадгална.
#     Буцаах нь: сегментүүдийн цаг хугацаа, зам, файл
#     """
#     os.makedirs(output_dir, exist_ok=True)

#     pipeline = Pipeline.from_pretrained(
#         "pyannote/voice-activity-detection", use_auth_token=hf_token
#     )
#     pipeline.to(torch.device("cuda" if torch.cuda.is_available() else "cpu"))

#     vad_result = pipeline(audio_path)
#     audio, sr = librosa.load(audio_path, sr=None)

#     padding = 0.15
#     segments_info = []
#     chunk_index = 0

#     for segment in vad_result.itersegments():   
#         start_time = max(0, segment.start - padding)
#         end_time = segment.end

#         start_sample = int(start_time * sr)
#         end_sample = int(end_time * sr)

#         chunk = audio[start_sample:end_sample]
#         output_filename = f"segment_{chunk_index:04d}.wav"
#         output_path = os.path.join(output_dir, output_filename)

#         sf.write(output_path, chunk, sr)

#         segments_info.append({
#             "file": output_filename,
#             "start": round(start_time, 2),
#             "end": round(end_time, 2),
#             "path": output_path
#         })

#         chunk_index += 1

#     return segments_info


# def format_srt(results):
#     def sec_to_srt_time(sec):
#         m, s = divmod(int(sec), 60)
#         ms = int((sec - int(sec)) * 1000)
#         return f"{m:02}:{s:02},{ms:03}"

#     srt = ""
#     for i, res in enumerate(results, 1):
#         start = sec_to_srt_time(res["start"])
#         end = sec_to_srt_time(res["end"])
#         srt += f"{i}\n{start} --> {end}\n{res['text']}\n\n"
#     return srt





# class Language(str, Enum):
#     mongolian = 'Mongolian'
#     english = 'English'

# import os
# import subprocess
# # from fastapi.middleware.cors import CORSMiddleware

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# @app.post("/analyze")
# async def analyze(
#     source_lang: Language = Form(...),
#     target_lang: Language = Form(...),
#     file: UploadFile = File(None),
#     url:str= Form(None),
# ):

#     if not file and not url:
#         raise HTTPException(
#             status_code=400,
#             detail='You must provide either a file or a URL.'
#         )

#     # audio_dir = os.path.join('audio', 'full')
#     # os.makedirs(audio_dir, exist_ok=True)


#     audio_mp4 = 'audio_mp4'
#     os.makedirs(audio_mp4, exist_ok=True)

    
#     audio_wav = 'audio_wav'
#     os.makedirs(audio_wav, exist_ok=True)

    
#     if file:
#         filename = file.filename
#         input_path = os.path.join(audio_mp4, filename)

#         with open(input_path, "wb") as buffer:
#             buffer.write(await file.read())

#         wav_path = os.path.join(audio_wav, 'audio.wav')

#         command = [
#             "ffmpeg",
#             "-i", input_path,         
#             "-vn",                    
#             "-acodec", "pcm_s16le",  
#             "-ar", "16000",           
#             "-ac", "1",               
#             wav_path
#         ]   

#         print("run subprocessing...")
#         subprocess.run(command, check=True)


#         print('start segmenting...')
#         segments = segment_audio_vad(wav_path, 'segments', hf_token)

#         return{"success"}

#         #results = []

#         # for seg in segments:
#         #     text = gemma.transcribe_audio(seg['path'])

#         #     results.append({
#         #         "start": seg["start"],
#         #         "end": seg["end"],
#         #         "text": text
#         #     })

#         # return {
#         # "srt": format_srt(results),
#         # "segments": results
#         # }   
        



#     # if url:
#     #     base_audio_file = os.path.join(audio_dir, 'audio.%(ext)s')
#     #     print("YouTube-с аудио татаж байна...")
#     #     ydl_opts = {
#     #         'format': 'bestaudio/best',
#     #         'outtmpl': base_audio_file,
#     #         'postprocessors': [{
#     #             'key': 'FFmpegExtractAudio',
#     #             'preferredcodec': 'mp3',
#     #         }],
#     #         'noplaylist': True,
#     #         'verbose': True
#     #     }
#     #     with YoutubeDL(ydl_opts) as ydl:
#     #         ydl.download([url])
    
    
    
