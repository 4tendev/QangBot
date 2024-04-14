from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from datetime import timedelta
from django.utils import timezone

import pyotp
import redis

from core.settings import REDIS_URL


redis_client = redis.from_url(REDIS_URL, decode_responses=True)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    TOTPKey = models.CharField(max_length=50, null=True, unique=True)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    objects = CustomUserManager()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.TOTP = pyotp.TOTP(self.TOTPKey) if self.TOTPKey else None
        self.TOTPredisKey = str(self.id) + "TOTP"

    def canPassTotp(self, code):
        TOTP = self.TOTP
        if TOTP != None:
            if not code:
                return None
            if not self.TOTP.verify(otp=code, valid_window=1):
                return False
        return True

    def recentlyRemovedTOTP(self):
        WEEK = 60*60*24*7
        redis_client.setex(self.TOTPredisKey, WEEK, 1)

    def isRecentlyRemovedTOTP(self):
        return True if redis_client.get(self.TOTPredisKey) else False

    def __str__(self):
        return self.email


class Limit(models.Model):
    bot = 2
    grids = 100
    interval = 60
    validVIPTime = models.DateTimeField(
        auto_now=False, auto_now_add=False, blank=True, null=True)
    user = models.OneToOneField(
        User, related_name="Limit",  on_delete=models.PROTECT)
    VIPPrice = 0.0025

    def isUserVIP(self):
        now = timezone.now()
        if self.validVIPTime and now < self.validVIPTime:
            return True
        return False

    def updateVIPTime(self):
        now = timezone.now()
        if self.validVIPTime == None or now > self.validVIPTime:
            self.validVIPTime = now + timedelta(days=370)
        else:
            self.validVIPTime = self.validVIPTime + timedelta(days=370)
        self.save()

    def __str__(self):
        return self.user.username
