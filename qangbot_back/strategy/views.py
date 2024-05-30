from django.http import JsonResponse
from .models import Strategy, ParticipantBill





def participant(request):
    value = 0
    user = request.user
    if user.is_authenticated:
        participants = user.Participants.all()
        if participants:
            for participant in participants:
                strategy = participant.strategy
                value += participant.share *  strategy.lastUSDCheck
    data = {
        "code": "200",
        "data": {"value": round(value ,0)}
    }
    return JsonResponse(data=data)

def depositData(bill):
    return {
        "id" : bill.id,
        "address" : bill.btcAddress.address,
    
    }

def deposit(request) : 
    data={
        "code" : "400",
        "message" : "NOT Authurized"
    }
    user=request.user
    if not user.is_authenticated:
        return JsonResponse(data)
    bill = ParticipantBill.deposit(user)
    if not bill :
        return JsonResponse({"code" : "500"})
    return JsonResponse(
        {
            "code" : "200",
            "data" : depositData(bill)
        }
    )



def history(request ,strategyID ):
    strategy = Strategy.objects.get(id =strategyID)
    data = {"code": "200",
            "data":(strategy.chachedHistory() or [])
            }
    return JsonResponse(data=data)
