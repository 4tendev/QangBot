import json
from django.http import JsonResponse
from .models import GridBot, Exchange, Grid
from .forms import CreateBotForm, BotActions, CreateGridsForm, GridActions
# Create your views here.
serverErrorResponse = {
    "code": "500",
    "message": "Server Error"
}


def getGridData(grid):
    return {
        "id": grid.id,
        "status": grid.status,
        "size": grid.size,
        "sell": grid.sell,
        "buy": grid.buy,
        "nextPosition": grid.nextPosition
    }

def getContractData(contract):
    return {
        "name" : contract.name,
        "url" : contract.url,
    }

def getBotData(gridtBot: GridBot):
    return {
        "id": gridtBot.id,
        "name": gridtBot.name,
        "contract" : getContractData(gridtBot.contract),
        "contractName": gridtBot.contract.name,
        "exchangeName": gridtBot.contract.exchange.name,
        "status": gridtBot.status,
        "interval": gridtBot.interval,
        "accountName": gridtBot.account.name,
        "grids": [getGridData(grid) for grid in gridtBot.Grids.all()]
    }


def gridbots(request):
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
                gridBots = GridBot.objects.filter(user=user)
                if gridBots:
                    for gridBot in gridBots:
                        botsData.append(
                            getBotData(gridBot)

                        )
                data = {
                    "code": "200",
                    "data": {
                        "bots": botsData,
                        "canCreateBot": GridBot.canCreate(user)
                    }
                }
            case "POST":
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
                name = form.cleaned_data.get("name")
                try:
                    exchange = Exchange.objects.get(id=exchangeID)
                    contract = exchange.Contracts.get(id=contractID)
                    account_model = exchange.account_model
                    account = account_model.model_class().objects.get(id=accountID, user=user)
                    if not contract or not account:
                        return JsonResponse({"code": "400", "message": "Invalid Inputs"})
                except:
                    return JsonResponse({"code": "400", "message": "Invalid Inputs"})
                gridbot = GridBot.objects.create(
                    name=name, user=user, account_model=account_model, account_id=accountID, contract=contract)
                data = {
                    "code": "200",
                    "data": {
                        "gridbot": getBotData(gridbot)
                    }
                }
    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }
    return JsonResponse(data)


def exchanges(request):
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
                                "id": exchange.id,
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


def accounts(request, exchangeName):
    user = request.user
    try:
        if not user.is_authenticated:
            return JsonResponse(
                {
                    "code": "400",
                    "message": "Not Authurized"
                }
            )

        exchange = Exchange.objects.filter(name=exchangeName)

        if not exchange:
            return JsonResponse(
                {
                    "code": "400",
                    "message": "No Exchange"
                }
            )
        exchange = exchange[0]
        method = request.method
        match method:
            case "GET":
                data = {
                    "code": "200",
                    "data": {"accounts": [

                    ],
                        "accountFields": exchange.getAccountSecretFiledsName()


                    }
                }
                accounts = exchange.account_model.model_class().objects.filter(user=user)
                if accounts:
                    for account in accounts:
                        data["data"]["accounts"].append(
                            {
                                "id": account.id,
                                "name": account.name,
                            }
                        )
            case "POST":
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
                account = exchange.account_model.model_class()(**form.cleaned_data, user=user)
                if not account.checkAccount():
                    return JsonResponse(data)
                account = exchange.account_model.model_class(
                ).objects.create(**form.cleaned_data, user=user)
                data = {
                    "code": "200",
                    "data": {
                        "id": account.id,
                        "name": account.name,
                    }
                }
    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }

    return JsonResponse(data)


def contracts(request, exchangeName):
    try:
        exchange = Exchange.objects.filter(name=exchangeName)
        if not exchange:
            return JsonResponse(
                {
                    "code": "400",
                    "message": "No Exchange"
                }
            )
        exchange = exchange[0]
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
                                "id": contract.id,
                                "name": contract.name,
                                "url": contract.url
                            }
                        )

    except Exception as e:
        print(e)
        data = {
            "code": "500",
            "message": "Server Error"
        }

    return JsonResponse(data)


def gridbot(request, id):
    user = request.user

    data = {
        "code": "400",
        "message": "BAD REQUEST"
    }
    if not user.is_authenticated:
        return JsonResponse(
            data
        )
    if not id > 0:
        return JsonResponse(
            data
        )
    try:
        gridBot = GridBot.objects.filter(id=id, user=user)
        if not gridBot:
            return JsonResponse(
                {
                    "code": "400",
                    "message": "Not Found"
                }
            )
        gridBot = gridBot[0]
        match request.method:
            case "GET":
                data = {
                    "code": "200",
                    "data": getBotData(gridBot)
                }
            case "OPTIONS":
                form_data = json.loads(request.body)
                form = BotActions(form_data)
                data = {
                    "code": "400",
                    "message": "invalid  Input"
                }
                if not form.is_valid():
                    return JsonResponse(data)
                match form.cleaned_data.get("action"):
                    case "stop":
                        gridBot = GridBot.stop(gridBot)
                        if gridBot:
                            data = {
                                "code": "200",
                                "data": getBotData(gridBot)
                            }
                        else:
                            data = {
                                "code": "500",
                                "message": "Server Error"
                            }

                    case "resume":
                        gridBot.status = True
                        gridBot.save()
                        data = {
                            "code": "200",
                            "data": getBotData(gridBot)
                        }
    except Exception as e:
        print(e)
        return JsonResponse({
            "code": "500",
            "message": "Server Error"
        })
    return JsonResponse(data)


def grids(request, botID):
    user = request.user

    data = {
        "code": "400",
        "message": "BAD REQUEST"
    }
    if not user.is_authenticated:
        return JsonResponse(
            data
        )
    if not botID > 0:
        return JsonResponse(
            data
        )

    try:
        gridbot = GridBot.objects.filter(user=user, id=botID)
        if not gridbot:
            return JsonResponse(data)
        gridbot = gridbot[0]
        grids = gridbot.Grids.all()
        data = {
            "code": "200",
                    "data": []
        }
        match request.method:
            case "GET":
                if grids:
                    for grid in grids:
                        data["data"].append(
                            getGridData(grid)
                        )
            case "POST":
                form_data = json.loads(request.body)
                form = CreateGridsForm(form_data)
                data = {
                    "code": "400",
                    "message": "invalid  Input"
                }
                if not form.is_valid():
                    return JsonResponse(data)
                grids = form.cleaned_data.get("grids")
                if not gridbot.canCreateNewGrids(len(grids)):
                    return JsonResponse({"code": "4003"})
                instances = [Grid(sell=grid["sell"], buy=grid["buy"], gridbot=gridbot, status=0,
                                  nextPosition=grid["nextPosition"], size=grid["size"]) for grid in grids]
                grids = Grid.objects.bulk_create(instances)
                data = {"code": "200", "data": []}
                for grid in grids:
                    data["data"].append(getGridData(grid))
            case "DELETE":
                if not gridbot.removeAllGrids():
                    data = serverErrorResponse
    except Exception as e:
        print(e)
        return JsonResponse(serverErrorResponse)
    return JsonResponse(data)


def grid(request, gridID):
    user = request.user

    data = {
        "code": "400",
        "message": "BAD REQUEST"
    }
    if not user.is_authenticated:
        return JsonResponse(
            data
        )
    if not gridID > 0:
        return JsonResponse(
            data
        )

    try:
        grid = Grid.objects.filter(id=gridID, gridbot__user=user)

        if not grid:
            return JsonResponse(
                data
            )
        grid = grid[0]
        match request.method:
            case "GET":
                data = {
                    "code": "200",
                    "data": getGridData(grid)
                }
            case "OPTIONS":
                form_data = json.loads(request.body)
                form = GridActions(form_data)
                data = {
                    "code": "400",
                    "message": "invalid  Input"
                }
                if not form.is_valid():
                    return JsonResponse(data)
                match form.cleaned_data.get("action"):
                    case "pause":
                        grid = grid.pause()
                        data = {
                            "code": "200",
                            "data":  getGridData(grid)
                        }
                    case "resumeSell":
                        grid = grid.resume(1)
                        data = {
                            "code": "200",
                            "data":  getGridData(grid)
                        }
                    case "resumeBuy":
                        grid = grid.resume(2)
                        data = {
                            "code": "200",
                            "data":  getGridData(grid)
                        }
            case "DELETE":
                grid.delete()
                data = {
                    "code": "200",
                    "message":  "deleted"
                }
    except:
        return JsonResponse(serverErrorResponse)
    return JsonResponse(data)
