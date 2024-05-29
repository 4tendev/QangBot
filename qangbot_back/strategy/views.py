from django.http import JsonResponse
from .models import Strategy, History, Participant





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
    strategy = Strategy.objects.all()[0]
    data = {"code": "200",
            "data":(strategy.chachedHistory() or [])
            }
    return JsonResponse(data=data)
