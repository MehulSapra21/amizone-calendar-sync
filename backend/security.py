import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from dotenv import load_dotenv, find_dotenv

# Explicitly find and load the .env file
load_dotenv(find_dotenv())

# Retrieve and validate the 32-byte AES key
RAW_KEY = os.getenv("ENCRYPTION_KEY", "")

# Let's temporarily print the length to debug if it still fails


if len(RAW_KEY.encode()) != 32:
    raise ValueError("ENCRYPTION_KEY must be exactly 32 bytes long for AES-256.")

AES_KEY = RAW_KEY.encode()

def encrypt_data(plain_text: str) -> str:
    """Encrypts plain text using AES-256-GCM and returns a base64 encoded string."""
    aesgcm = AESGCM(AES_KEY)
    nonce = os.urandom(12)  # Standard 96-bit nonce for GCM
    encrypted = aesgcm.encrypt(nonce, plain_text.encode('utf-8'), None)
    # Pack nonce + ciphertext together and base64-encode for easy text storage
    return base64.b64encode(nonce + encrypted).decode('utf-8')

def decrypt_data(cipher_text_b64: str) -> str:
    """Decrypts a base64 encoded string back to plain text."""
    data = base64.b64decode(cipher_text_b64.encode('utf-8'))
    nonce = data[:12]
    ciphertext = data[12:]
    aesgcm = AESGCM(AES_KEY)
    decrypted = aesgcm.decrypt(nonce, ciphertext, None)
    return decrypted.decode('utf-8')