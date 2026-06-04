import os
import base64

def generate_auth_token():
    # Generate 32 random bytes
    token_bytes = os.urandom(32)
    # Encode them as Base64
    token = base64.b64encode(token_bytes).decode('utf-8')
    return token

# Example usage
print("Generated Auth Token:", generate_auth_token())