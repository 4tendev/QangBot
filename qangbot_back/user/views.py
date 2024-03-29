
import json

from django.http import JsonResponse
from django.contrib.auth import login,authenticate,logout

from django_ratelimit.decorators import ratelimit

from .forms import LoginForm 


from core.settings import DEBUG
from .models import TOTP

    
def usernameInput(group, request):
    if request.method == "PATCH":
        return json.loads(request.body).get('username')

@ratelimit(key=usernameInput, method=[ 'PATCH'], block=False, rate='45/d')
@ratelimit(key=usernameInput, method=[ 'PATCH'], block=False, rate='15/m')
def auth(request):
    if getattr(request, 'limited', False) :
        data = {"code":"429"}
        return JsonResponse(data)
    try :
        data = {
                 "code": "405",
                 "message" : "Method not Allowed"
                        }
        method = request.method
        match method:
            case "GET":
                user=request.user
                data = {
                        "code": "401",
                        "message" : "User Unknown"
                        } 
                if  user.is_authenticated  :
                    data = {
                            "code": "200",
                            "message" : "known User"
                            }  
            case "PATCH":
                form_data = json.loads(request.body)
                form= LoginForm(form_data)
                data = {"code": "400","message" :"Cant authurize"}
                if not form.is_valid():
                    return JsonResponse(data)
                totpCode=form.cleaned_data.get("TOTPCode")
                username= form.cleaned_data.get("username").lower()
                password= form.cleaned_data.get("password")
                user = authenticate(username=username, password=password)
                if user is None:
                    return JsonResponse(data)
                totpCheckPass =TOTP.canPassTotp(user,totpCode)
                if not totpCheckPass :
                    responseCode ,responseMessage = "4006" , "TOTP REQUIRED" if totpCheckPass == None else "4007" ,"TOTP Wrong"
                    return JsonResponse({"code": responseCode ,"message" : responseMessage})
                login(request, user)
                session_id = request.session.session_key 
                data = {
                                "code" : "200",
                                "message" : "Successfully authurized",
                                "data" : {"sessionid" : session_id}
                                }                
            case "DELETE":
                logout(request)
                data = {
                        "code" : "200"
                        }
    except Exception as e:
        print(e)
        data = {
                "code" : "500",
                "message" : "Server Error"
                }
    return JsonResponse(data)         


