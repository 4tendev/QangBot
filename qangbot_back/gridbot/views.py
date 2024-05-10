from django.shortcuts import render
from django.http import JsonResponse
from .models import GridBot, Exchange
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
                        "bots": botsData
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
                                "name": exchange.name,
                                "accountRequirement" :  exchange.getAccountSecretFiledsName()
                             
                            }
                        )

    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }
    return JsonResponse(data)
