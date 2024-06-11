from django.http import JsonResponse
from .models import Strategy, ParticipantBTCAddress, Withdraw
from .forms import WithdrawForm

import json


def participantValue(participant):
    strategy = participant.strategy
    return participant.share * strategy.lastUSDCheck


def participantsValue(participants):
    value = 0
    for participant in participants:
        value += participantValue(participant)
    return value


def participant(request):
    value = 0
    user = request.user
    if user.is_authenticated:
        participants = user.Participants.all()
        if participants:
            value = participantsValue(participants)
    data = {
        "code": "200",
        "data": {"value": round(value, 0)}
    }
    return JsonResponse(data=data)


def transactionData(transaction):
    return {
        "txHash": transaction.txHash,
        "id": transaction.id,
        "amount": transaction.assetValue.filter(asset__name="BTC")[0].amount if transaction.assetValue.filter(asset__name="BTC") else None,
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


def withdrawData(withdraw: Withdraw):
    return {
        "id": withdraw.id, "BTCAddress": withdraw .BTCAddress,
        "status": withdraw.status,
        "fee": withdraw.fee.amount if withdraw.fee else None,
        "amount": withdraw.amount.amount if withdraw.amount else None,

    }


def withdraw(request):
    data = {
        "code": "400",
        "message": "Bad Request"
    }
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data)

    method = request.method
    if  method == "GET" :
            data = {
                "data": [],
                "code": "200"
            }
            withdraws = user.Withdraws.all()
            if withdraws:
                for withdraw in withdraws:
                    data["data"].append(
                        withdrawData(withdraw)
                    )
    elif  method == "POST" :
            participants = user.Participants.all()
            if not participants:

                return JsonResponse(data)
            if not participantsValue(participants) > 0:

                return JsonResponse(data)
            form_data = json.loads(request.body)
            form = WithdrawForm(form_data)
            if not form.is_valid():
                return JsonResponse(data)
            TOTPCode = form.cleaned_data.get("TOTPCode")
            if not user.canPassTotp(TOTPCode) or not user.TOTPActivated():
                data = {
                    "code": "401",
                    "message": "Wrong TOTP Code"
                }
                return JsonResponse(data)
            BTCAddress = form.cleaned_data.get("BTCAddress")
            withdraw = Withdraw.objects.create(
                user=user, BTCAddress=BTCAddress)
            data = {
                "code": "200",
                "data": withdrawData(withdraw)

            }
    return JsonResponse(data)


def history(request, strategyID):
    strategy = Strategy.objects.get(id=strategyID)
    data = {"code": "200",
            "data": (strategy.chachedHistory() or [])
            }
    return JsonResponse(data=data)
