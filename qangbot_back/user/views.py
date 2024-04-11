import json

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User

from django_ratelimit.decorators import ratelimit

from .forms import LoginForm, RegisterForm
from .models import TOTP
from .EmailOTP import createCode, checkCode


def usernameInput(group, request):
    if request.method == "PATCH":
        return json.loads(request.body).get('username')


@ratelimit(key=usernameInput, method=['PATCH'], block=False, rate='45/d')
@ratelimit(key=usernameInput, method=['PATCH'], block=False, rate='15/m')
def auth(request):
    if getattr(request, 'limited', False):
        data = {"code": "429",
                "message": "To Many Tries"}
        return JsonResponse(data)
    try:
        data = {
            "code": "405",
            "message": "Method not Allowed"
        }
        method = request.method
        match method:
            case "GET":
                user = request.user
                data = {
                    "code": "401",
                    "message": "User Unknown"
                }
                if user.is_authenticated:
                    data = {
                        "code": "200",
                        "message": "known User",
                    }
            case "PATCH":
                form_data = json.loads(request.body)
                form = LoginForm(form_data)
                data = {
                    "code": "400",
                    "message": "Cant authurize"
                }
                if not form.is_valid():
                    return JsonResponse(data)
                totpCode = form.cleaned_data.get("TOTPCode")
                username = form.cleaned_data.get("username").lower()
                password = form.cleaned_data.get("password")
                trustedDevice = form.cleaned_data.get("trustedDevice") or False
                user = authenticate(username=username, password=password)
                if user is None:
                    return JsonResponse(data)
                totpCheckPass = TOTP.canPassTotp(user, totpCode)
                if not totpCheckPass:
                    responseCode, responseMessage = "4006", "TOTP REQUIRED" if totpCheckPass == None else "4007", "TOTP Wrong"
                    return JsonResponse({"code": responseCode, "message": responseMessage})
                login(request, user)
                if not trustedDevice:
                    request.session.set_expiry(0)
                data = {
                    "code": "200",
                    "message": "Successfully authurized",
                }
            case "DELETE":
                logout(request)
                data = {
                    "code": "200"
                }
            case "POST":
                VERIFY_FOR_REGISTER = "REGISTERATION"
                form_data = json.loads(request.body)
                form = RegisterForm(form_data)
                data = {
                    "code": "400",
                    "meesage": "Invalid inputs"
                }
                if form.is_valid():
                    password = form.cleaned_data.get("password")
                    trustedDevice = form.cleaned_data.get(
                        "trustedDevice") or False
                    email = form.cleaned_data.get("email")
                    username = form.cleaned_data.get("username").lower()
                    if User.objects.filter(username=username):
                        data = {
                            "code": "4001",
                            "message": "Username already exist"
                        }
                        return JsonResponse(data)
                    if User.objects.filter(email=email):
                        data = {
                            "code": "4002",
                            "message": "Email already exist"
                        }
                        return JsonResponse(data)
                    emailCode = form.cleaned_data.get(
                        "emailCode")
                    match len(emailCode):
                        case  0:
                            data = {
                                "code": "500",
                                "message" : "Server Error"
                            }
                            timeRemaining = createCode(
                                email, VERIFY_FOR_REGISTER)
                            if timeRemaining:
                                data = {
                                    "code": "201",
                                    "data" : {"timeRemaining": timeRemaining,},
                                    "message": "Code Sent"
                                }
                        case  6:
                            isCodeAcceptable = checkCode(
                                email, VERIFY_FOR_REGISTER, emailCode)
                            if isCodeAcceptable:
                                user = User.objects.create_user(
                                    username=username, password=password, email=email)
                                data = {
                                    "code": "200",
                                    "message": "Created"
                                }
                                login(request, user)
                                if not trustedDevice:
                                    request.session.set_expiry(0)

                            elif isCodeAcceptable is None:
                                data = {
                                    "code": "4003",
                                    "message": "ASK NEW CODE"
                                }
                            else:
                                data = {
                                    "code": "4004",
                                    "message": "Wrong VERIFICATION Code"
                                }
    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }

    return JsonResponse(data)
