from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone

import pyotp ,redis

from core.settings import REDIS_URL



redis_client=redis.from_url(REDIS_URL,decode_responses=True)

class TOTP(models.Model) :
    key=models.CharField( max_length=50 ,null=False ,unique=True)
    user=models.OneToOneField(User,related_name="TOTP" ,  on_delete=models.CASCADE )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.TOTP =pyotp.TOTP(self.key)
        self.redisKey=str(self.user.id) + "TOTP"

    def checkCode(self , TOTPCode) :
        return self.TOTP.verify(otp=TOTPCode,valid_window=1)
    
    def recentlyRemoved(self) :
        WEEK =60*60*24*7
        redis_client.setex(self.redisKey,WEEK,1)

    def remove(self) :
        self.recentlyRemoved()
        self.delete()

    def isRecentlyRemoved(self) :
        return True if redis_client.get(self.redisKey) else False
    
    def canPassTotp(user , code) :
        try :
            user.TOTP
            if not code:
                return None
            if not user.TOTP.checkCode(code) :
                return False
        except :
            pass
        return True
    




class Limit(models.Model) :
    bot=2
    grids=100
    interval=60
    validVIPTime=models.DateTimeField(auto_now=False, auto_now_add=False ,blank=True, null =True)
    user=models.OneToOneField(User,related_name="Limit" ,  on_delete=models.PROTECT )
    VIPPrice=0.0025
    def isUserVIP (self) :
        now = timezone.now()
        if self.validVIPTime and now < self.validVIPTime:
            return True
        return False
    def updateVIPTime(self):
        now = timezone.now()
        if self.validVIPTime ==None or now > self.validVIPTime :
            self.validVIPTime = now + timedelta(days=370)
        else :
            self.validVIPTime = self.validVIPTime + timedelta(days=370)
        self.save()
    def __str__(self):
        return self.user.username
