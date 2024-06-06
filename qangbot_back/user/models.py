from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.cache import cache

import pyotp
import redis
import requests

from datetime import datetime, timedelta

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


class VIP:
    price = 0.0025


class User(AbstractBaseUser, PermissionsMixin):

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    TOTPKey = models.CharField(
        max_length=50, blank=True, null=True, unique=True)
    email = models.EmailField(unique=True)
    vipExpiration = models.DateTimeField(
        null=True, blank=True, auto_now=False, auto_now_add=False)
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    objects = CustomUserManager()
    VIPPRICE = VIP.price

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

    def TOTPActivated(self):
        return self.TOTPKey != None

    def updateVIPTime(self, days=370):
        now = datetime.now()
        if self.validVIPTime == None or now > self.validVIPTime:
            self.validVIPTime = now + timedelta(days=days)
        else:
            self.validVIPTime = self.validVIPTime + timedelta(days=days)
        self.save()

    def isVIP(self):
        return self.is_superuser or (self.vipExpiration > datetime.now() if self.vipExpiration else False)

    def __str__(self):
        return self.email


class VIPBTCAddress(models.Model):
    address = models.CharField(unique=True, max_length=100)
    user = models.ForeignKey(User, related_name="VIPBTCAddresses",
                             on_delete=models.PROTECT, blank=True, null=True)
    paid = models.BooleanField(default=False)

    def checkPaid(self):
        address = self.address
        if self.paid:
            return True
        if VIPBTCAddress.objects.filter(id=self.id, paid=False) and not cache.get(address):
            response = requests.get(
                f"https://mempool.space/api/address/{address}")
            cache.set(address, 1, timeout=300)
            if response.status_code == 200:
                totalRecieved = response.json(
                )["chain_stats"]["funded_txo_sum"]
                if totalRecieved > VIP.price * 100_000_000:
                    self.paid = True
                    self.save()
                    self.user.updateVIPTime()
                    return True

    def depositAddress(user):
        address = VIPBTCAddress.objects.filter(paid=False, user=user)
        if address:
            return address[0].address
        address = VIPBTCAddress.objects.filter(
            paid=False, user__isnull=True)[0]
        address.user = user
        address.save()
        return address.address
