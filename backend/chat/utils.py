import hashlib
import time
import uuid

__all__ = ("create_hash",)

def create_hash(key: str = uuid.uuid4()):
    hash = hashlib.sha3_512()
    hash.update(f"{time.time()}{key}".encode())
    return hash.hexdigest()