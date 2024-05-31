from django.http import JsonResponse
from .models import Strategy, ParticipantBTCAddress


def participant(request):
    value = 0
    user = request.user
    if user.is_authenticated:
        participants = user.Participants.all()
        if participants:
            for participant in participants:
                strategy = participant.strategy
                value += participant.share * strategy.lastUSDCheck
    data = {
        "code": "200",
        "data": {"value": round(value, 0)}
    }
    return JsonResponse(data=data)


def transactionData(transaction):
    return {
        "txHash": transaction.txHash,
        "id": transaction.id,
        "amount":transaction.assetValue.filter(asset__name="BTC")[0].amount if transaction.assetValue.filter(asset__name="BTC") else None,
        "share": transaction.assetValue.filter(asset__name="USD")[0].amount if transaction.assetValue.filter(asset__name="USD") else None
    }


def depositData(depositAddress):
    return {
        "id": depositAddress.id,
        "address": depositAddress.address,
        "transactions": [transactionData(transaction) for transaction in depositAddress.Transactions.all().order_by("-pk")]
    }


def deposit(request):
    data = {
        "code": "400",
        "message": "NOT Authurized"
    }
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data)

    depositAddress = ParticipantBTCAddress.depositAddress(user)
    if not depositAddress:
        return JsonResponse({"code": "500"})
    try:
        depositAddress.checkTransaction()
    except Exception as e:
        print(e)
    return JsonResponse(
        {
            "code": "200",
            "data": depositData(depositAddress)
        }
    )


def history(request, strategyID):
    strategy = Strategy.objects.get(id=strategyID)
    data = {"code": "200",
            "data": (strategy.chachedHistory() or [])
            }
    return JsonResponse(data=data)
