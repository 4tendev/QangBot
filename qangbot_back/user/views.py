import json

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout, update_session_auth_hash

from django_ratelimit.decorators import ratelimit

from .forms import LoginForm, RegisterForm, ResetPasswordForm, ChangePasswordForm
from .models import User
from .EmailOTP import createCode, checkCode


def emailInput(group, request):
    if request.method == "PATCH":
        return json.loads(request.body).get('email')


def userID(group, request):
    if request.method == "PUT":
        return str(request.user.id)


def vip(request):
    return JsonResponse({
        "code": "200",
        "data": {
            "price": User.VIPPRICE}
    })


@ratelimit(key=emailInput, method=['PATCH'], block=False, rate='45/d')
@ratelimit(key=emailInput, method=['PATCH'], block=False, rate='15/m')
@ratelimit(key=userID, method=['PUT'], block=False, rate='20/d')
def auth(request):
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
                    "message": "User Unknown",
                    "data": {
                        "isKnown": False,
                        "isVIP": False,
                        "vipExpiration":  None
                    }
                }
                if user.is_authenticated:
                    data = {
                        "code": "200",
                        "message": "known User",
                        "data": {
                            "isKnown": True,
                            "isVIP": user.isVIP(),
                            "vipExpiration":  user.vipExpiration.date()
                        }
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
                email = form.cleaned_data.get("email").lower()
                password = form.cleaned_data.get("password")
                trustedDevice = form.cleaned_data.get("trustedDevice") or False
                emailCode = form.cleaned_data.get("emailCode") or False

                if getattr(request, 'limited', False):
                    user = User.objects.filter(
                        email=email
                    )
                    data = {"code": "400",
                            "message": "Cant authurize"
                            }
                    if not user:
                        return JsonResponse(data)
                    VERIFY_FOR_LOGIN = "LOGIN"
                    if not emailCode:

                        timeRemaining = createCode(
                            email, VERIFY_FOR_LOGIN)
                        data = {
                            "code": "429",
                                    "data": {"timeRemaining": timeRemaining, },
                                    "message": "to many tries ,Code Sent"
                        }
                        return JsonResponse(data)
                    isCodeAcceptable = checkCode(
                        email, VERIFY_FOR_LOGIN, emailCode)
                    if not isCodeAcceptable:
                        if isCodeAcceptable is None:
                            data = {
                                "code": "4290",
                                "message": "ASK NEW emailCODE"
                            }
                        elif isCodeAcceptable is False:
                            data = {
                                "code": "4291",
                                "message": "Wrong emailCode Code"
                            }
                        return JsonResponse(data)

                user = authenticate(email=email, password=password)
                if user is None:
                    return JsonResponse(data)
                totpCheckPass = user.canPassTotp(totpCode)
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
                                "message": "Server Error"
                            }
                            timeRemaining = createCode(
                                email, VERIFY_FOR_REGISTER)
                            if timeRemaining:
                                data = {
                                    "code": "201",
                                    "data": {"timeRemaining": timeRemaining, },
                                    "message": "Code Sent"
                                }
                        case  6:
                            isCodeAcceptable = checkCode(
                                email, VERIFY_FOR_REGISTER, emailCode)
                            if isCodeAcceptable:
                                user = User.objects.create_user(
                                    password=password, email=email)
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
            case "OPTIONS":
                RESET_PASSWROD = "ResetPassword"
                form_data = json.loads(request.body)
                form = ResetPasswordForm(form_data)
                data = {
                    "code": "400",
                    "message": "Invalid Inputs "
                }
                if not form.is_valid():
                    return JsonResponse(data)
                email = form.cleaned_data.get("email")
                user = User.objects.filter(
                    email=email)
                if not user:
                    data = {
                        "code": "4001",
                        "message": "No USER FOUND"
                    }
                    return JsonResponse(data)
                emailCode = form.cleaned_data.get("emailCode")
                newPassword = form.cleaned_data.get("newPassword")
                trustedDevice = form.cleaned_data.get("trustedDevice") or False
                if not emailCode:
                    data = {
                        "code": "500",
                                "message": "Server Error"
                    }
                    timeRemaining = createCode(
                        email, RESET_PASSWROD)
                    if timeRemaining:
                        data = {
                            "code": "201",
                            "data": {"timeRemaining": timeRemaining, },
                            "message": "Code Sent"
                        }
                else:
                    isCodeAcceptable = checkCode(
                        email, RESET_PASSWROD, emailCode)
                    if isCodeAcceptable:
                        if not newPassword:
                            return JsonResponse({"code": "400", "message": "INVALID INPUTS"})
                        user = user[0]
                        user.set_password(newPassword)
                        user.save()
                        update_session_auth_hash(request, user)
                        login(request, user)
                        data = {
                            "code": "200",
                            "message": "Password Changed"
                        }
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
            case "PUT":
                if getattr(request, 'limited', False):
                    data = {
                        "code": "429",
                        "message": "to many tries "
                    }
                    return JsonResponse(data)
                user = request.user
                data = {
                    "code": "401",
                    "message": "User Unknown"
                }
                if not user:
                    return JsonResponse(data)
                form_data = json.loads(request.body)
                form = ChangePasswordForm(form_data)
                data = {
                    "code": "400",
                    "message": "invalid Inputs "
                }

                if not form.is_valid():
                    return JsonResponse(data)
                password = form.cleaned_data.get("password")
                newPassword = form.cleaned_data.get("newPassword")
                user = authenticate(email=user.email, password=password)
                if not user:
                    data = {
                        "code": "4001",
                        "message": "invalid Password "
                    }
                    return JsonResponse(data)
                user.set_password(newPassword)
                user.save()
                update_session_auth_hash(request, user)
                login(request, user)
                data = {"code": "200", "message": "Password renewed"}
    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }

    return JsonResponse(data)
