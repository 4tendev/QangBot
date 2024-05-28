from django.http import JsonResponse
from .models import Strategy, History, Participant


def getHistoryDate(history: History):
    return {
        "id": history.id,
        "btcROI": history.btcROI,
        "ethROI": history.ethROI,
        "usdROI": history.usdROI,
        "date":  history.date
    }


def participant(request):
    value = 0
    user = request.user
    if user.is_authenticated:
        participants = user.Participants.all()
        if participants:
            for participant in participants:
                strategy = participant.strategy
                value += participant.share * (strategy.baseAssetValues.get(
                    asset__name="USD").amount) * ((strategy.Histories.all().order_by("-date")[0].usdROI + 100)/100)
    data = {
        "code": "200",
        "data": {"value": round(value , 2)}
    }
    return JsonResponse(data=data)


def history(request):
    Strategy.objects.all()[0].Histories.all()
    histrories = Strategy.objects.all()[0].Histories.all().order_by("date")
    data = {"code": "200",
            "data": [getHistoryDate(history) for history in histrories
                     ]if histrories else []
            }
    return JsonResponse(data=data)
