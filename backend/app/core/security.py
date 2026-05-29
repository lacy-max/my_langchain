import uuid

VALID_USERS = {"admin": "123456"}
def authenticate_user(username: str, password: str):
    if username in VALID_USERS and VALID_USERS[username] == password:
        user_id = str(uuid.uuid4())
        return user_id
    return None