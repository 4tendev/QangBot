from django.http import JsonResponse
from .models import Strategy, History


def getHistoryDate(history: History):
    return {
        "id": history.id,
        "btcROI": history.btcROI,
        "ethROI": history.ethROI,
        "usdROI": history.usdROI,
        "date":  history.date
    }


def history(request):
    Strategy.objects.all()[0].Histories.all()
    histrories = Strategy.objects.all()[0].Histories.all().order_by("date")
    data = {"code": "200",
            "data": [getHistoryDate(history) for history in histrories
                     ]if histrories else []
            }
    return JsonResponse(data=data)
