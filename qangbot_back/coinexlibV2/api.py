

from .request_client import RequestClient


class CoinexPerpetualApiV2(object):
    ORDER_DIRECTION_SELL = 1
    ORDER_DIRECTION_BUY = 2

    MARGIN_ADJUST_TYPE_INCRESE = 1
    MARGIN_ADJUST_TYPE_DECREASE = 2

    POSITION_TYPE_ISOLATED = 1
    POSITION_TYPE_CROSS_MARGIN = 2

    def __init__(self, access_id, secret_key, proxy=None, logger=None):
        self.request_client = RequestClient(
            access_id, secret_key, proxy, logger)

    def ping(self):
        path = '/v2/ping'
        return self.request_client.get(path, sign=False)

    def subAccounts(self):
        path = '/v2/account/subs'
        return self.request_client.get(path, sign=True)


if __name__ == "__main__":
    access_id = ''
    secret_key = ''
    api = CoinexPerpetualApiV2(access_id, secret_key)
    print(api.ping())
