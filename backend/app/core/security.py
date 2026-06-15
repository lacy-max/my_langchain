import uuid

VALID_USERS = {"admin": "123456"}


def authenticate_user(username: str, password: str):
    if username in VALID_USERS and VALID_USERS[username] == password:
        return str(uuid.uuid5(uuid.NAMESPACE_URL, f"cuihua-user:{username}"))
    return None
