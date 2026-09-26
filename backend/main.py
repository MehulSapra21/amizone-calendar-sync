import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from security import encrypt_data
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = FastAPI(title="Amizone Calendar Sync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
supabase_admin: Client = create_client(supabase_url, supabase_key)

class AmizoneCredentials(BaseModel):
    user_id: str
    amizone_id: str
    amizone_password: str

@app.post("/api/credentials")
async def save_credentials(payload: AmizoneCredentials):
    try:
        encrypted_password = encrypt_data(payload.amizone_password)
        
        supabase_admin.table("profiles").upsert({
            "id": payload.user_id,
            "amizone_id": payload.amizone_id,
            "amizone_password_encrypted": encrypted_password
        }).execute()
        
        return {"status": "success", "message": "Credentials securely stored."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))