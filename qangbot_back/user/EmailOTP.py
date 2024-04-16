import redis
from random import randint
from core.settings import REDIS_URL, EMAIL_HOST_USER, DOMAIN
from django.core.mail import send_mail


redis_client = redis.from_url(REDIS_URL, decode_responses=True)


def key_creator(address, verify_for):
    return address+","+verify_for


def createCode(address, verify_for):
    key = key_creator(address, verify_for)
    if redis_client.exists(key):
        return int(redis_client.ttl(key))
    else:
        CODE_TIME_VALIDITY = 300
        code = str(randint(99999, 999999))
        try:
            subject = f'Email Verification {DOMAIN} {verify_for}'
            message = f'Here is the code: {code} to verify your access to {address}.'
            from_email = EMAIL_HOST_USER
            recipient_list = [address]
            response = send_mail(subject, message, from_email, recipient_list)
            if response == 1:
                redis_client.setex(key, CODE_TIME_VALIDITY, code)
                return CODE_TIME_VALIDITY
            else:
                return None
        except:
            return None


def checkCode(address, verify_for, code):
    key = key_creator(address, verify_for)
    answer = redis_client.get(key)
    if not answer:
        return None
    failed_key = key+"FAILED"
    if answer == str(code):
        redis_client.delete(key)
        redis_client.delete(failed_key)
        return True
    failed_try = redis_client.get(failed_key)
    if failed_try:
        redis_client.incr(failed_key)
        if int(failed_try) > 9:
            redis_client.delete(key)
            redis_client.delete(failed_key)
            return None
    else:
        time = redis_client.ttl(key)
        if time:
            redis_client.setex(failed_key, int(time), 1)
    return False
