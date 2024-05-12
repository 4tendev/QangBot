import json
from django.http import JsonResponse
from .models import GridBot, Exchange
from .forms import CreateBotForm
# Create your views here.


def bot(request):
    try:
        data = {
            "code": "405",
            "message": "Method not Allowed"
        }
        user = request.user
        if not user.is_authenticated:
            return JsonResponse(
                {
                    "code": "400",
                    "message": "Not Authurized"
                }
            )
        method = request.method
        match method:
            case "GET":
                botsData = []
                bots = GridBot.objects.filter(user=user)
                if bots:
                    for bot in bots:
                        botsData.append(
                            {
                                "id": bot.id,
                                "name": bot.name,
                                "contractName": bot.contract.name,
                                "exchangeName": bot.contract.exchange.name,
                            }
                        )
                data = {
                    "code": "200",
                    "data": {
                        "bots": botsData,
                        "canCreateBot" : GridBot.canCreate(user)
                    }
                }
            case "POST" :
                form_data = json.loads(request.body)
                form = CreateBotForm(form_data)
                data = {
                    "code": "400",
                    "message": "Cant authurize"
                }
                if not form.is_valid():
                    return JsonResponse(data)                
                exchangeID = form.cleaned_data.get("exchangeID")
                contractID = form.cleaned_data.get("contractID")
                accountID = form.cleaned_data.get("accountID")
                name= form.cleaned_data.get("name")
                try :
                    exchange = Exchange.objects.get(id=exchangeID)
                    contract = exchange.Contracts.get(id=contractID)
                    account_model=exchange.account_model
                    account = account_model.model_class().objects.get(id=accountID,user=user )
                    if not contract or not account :
                        return JsonResponse({"code" :"400" , "message" : "Invalid Inputs"})
                except :
                    return JsonResponse({"code" :"400" , "message" : "Invalid Inputs"})
                gridbot=GridBot.objects.create(name=name,user=user,account_model=account_model ,account_id =accountID , contract=contract )
                data = {
                    "code" : "200" ,
                    "data" : {
                        "gridbot" : {
                                "id": gridbot.id,
                                "name": gridbot.name,
                                "contractName": gridbot.contract.name,
                                "exchangeName": gridbot.contract.exchange.name,
                            }
                    }
                }
    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }
    return JsonResponse(data)


def exchange(request):
    try:
        method = request.method
        match method:
            case "GET":
             
                data = {
                    "code": "200",
                    "data": {"exchanges": [

                    ]}
                }
                exchanges = Exchange.objects.all()
                if exchanges:
                    for exchange in exchanges:
                        data["data"]["exchanges"].append(
                            {
                                "id" : exchange.id,
                                "name": exchange.name,                             
                            }
                        )

    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }
    return JsonResponse(data)


def account(request , exchangeName) :
    user=request.user
    try:
        if not user.is_authenticated:
            return JsonResponse(
                {
                    "code": "400",
                    "message": "Not Authurized"
                }
            ) 
          
        exchange = Exchange.objects.filter(name=exchangeName)  
        
        if not exchange :
            return JsonResponse(
                {
                    "code": "400",
                    "message": "No Exchange"
                }
            )   
        exchange=exchange[0]
        method = request.method
        match method:
            case "GET":
                data = {
                    "code": "200",
                    "data": {"accounts": [

                    ],
                    "accountFields" :exchange.getAccountSecretFiledsName()
                    
                    
                    }
                }
                accounts = exchange.account_model.model_class().objects.filter( user=user)
                if accounts:
                    for account in accounts:
                        data["data"]["accounts"].append(
                            {
                                "id" : account.id,
                                "name": account.name,
                            }
                        )
            case "POST" :
                form_data = json.loads(request.body)
                form = exchange.account_model.model_class().form(form_data)
                data = {
                    "code": "400",
                    "message": "invalid  Input"
                }
                if not form.is_valid():
                    return JsonResponse(data)   
                data = {
                    "code": "4001",
                    "message": "Cant Authuraioze"
                } 
                account=exchange.account_model.model_class()(**form.cleaned_data , user=user)
                print(form.cleaned_data)
                if not account.checkAccount() :
                    return JsonResponse(data)   
                account=exchange.account_model.model_class().objects.create(**form.cleaned_data , user=user)
                data={
                    "code" : "200",
                    "data" : {
                        "id" : account.id,
                        "name" :account.name,
                    }
                }
    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }    

    return JsonResponse(data)
def contract(request , exchangeName) :
    user=request.user
    try:

          
        exchange = Exchange.objects.filter(name=exchangeName)  
        
        if not exchange :
            return JsonResponse(
                {
                    "code": "400",
                    "message": "No Exchange"
                }
            )   
        exchange=exchange[0]
        method = request.method
        match method:
            case "GET":
                data = {
                    "code": "200",
                    "data": {"contracts": [

                    ]                    
                    }
                }
                contracts = exchange.Contracts.all()
                if contracts:
                    for contract in contracts:
                        data["data"]["contracts"].append(
                            {
                                "id" : contract.id,
                                "name": contract.name,
                                "url" : contract.url
                            }
                        )

    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }    

    return JsonResponse(data)