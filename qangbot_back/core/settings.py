"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 5.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import os

from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
AUTH_USER_MODEL = 'user.User'


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
REDIS_URL=os.getenv("REDIS_URL")
DEBUG = os.getenv("DEBUG") or False
DOMAIN=os.getenv("DOMAIN")
FRONT_HOST_HTTPS=os.getenv("FRONT_HOST_HTTPS")
INTERNAL_HOST=os.getenv("INTERNAL_HOST")
DEFAULT_PROXY_USERNAME=os.getenv("DEFAULT_PROXY_USERNAME")
DEFAULT_PROXY_PASSWORD=os.getenv("DEFAULT_PROXY_PASSWORD")
DEFAULT_PROXY_URL=os.getenv("DEFAULT_PROXY_URL")
ALLOWED_HOSTS = [DOMAIN,INTERNAL_HOST]
NONE_VIP_CREATION_LIMIT = os.getenv("NONE_VIP_CREATION_LIMIT")
NONE_VIP_GRIDS_CREATION_LIMIT =os.getenv("NONE_VIP_GRIDS_CREATION_LIMIT")

if DEBUG :
    CORS_ALLOW_ALL_ORIGINS = True  
else :
    CORS_ALLOW_ALL_ORIGINS = False 
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [FRONT_HOST_HTTPS]

SESSION_COOKIE_AGE = 31536000  

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'corsheaders',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "user",
    "gridbot"
]
from django.utils.deprecation import MiddlewareMixin

class DisableCSRFMiddleware(MiddlewareMixin):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)

class sleepMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response
        self.is_debug = DEBUG

    def __call__(self, request):
        if self.is_debug:
            import time
            time.sleep(0.5)  
        response = self.get_response(request)
        return response        

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'core.settings.DisableCSRFMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
MIDDLEWARE.append('core.settings.sleepMiddleware',)  if DEBUG  else None

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': REDIS_URL,
                }
    }   

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases


DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.environ.get("PGDATABASE"),
            'USER': os.environ["PGUSER"],
            'PASSWORD': os.environ["PGPASSWORD"],
            'HOST': os.environ["PGHOST"],
            'PORT': os.environ["PGPORT"],
        }
    } if os.environ.get("PGDATABASE") else {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
                }
    }



TIME_ZONE = 'UTC'

USE_I18N = False

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

STATIC_URL = f'https://static.{DOMAIN}/statics/' if DOMAIN != "127.0.0.1" else 'static/'
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_COOKIE_NAME = 'SESSIONID'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get("EMAIL_HOST")  
EMAIL_PORT = os.environ.get("EMAIL_PORT")
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")  
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
