

from .request_client import RequestClient


class CoinexPerpetualApiV2(object):
    ORDER_DIRECTION_SELL = "sell"
    ORDER_DIRECTION_BUY = "buy"

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
    
    def query_account(self):
        path = '/v2/assets/futures/balance'
        return self.request_client.get(path, sign=True)
    def put_limit_order(self, market, side, amount, price , market_type="FUTURES"):
        """
        # params:
            market	String	Yes	合约市场
            side	Integer	Yes	委托类型 1表示卖空，2表示买多
            amount	String	Yes	委托数量
            price	String	Yes	委托价格
            effect_type	Integer	No	委托生效类型，1: 一直有效直至取消, 2: 立刻成交或取消, 3: 完全成交或取消。默认为1
        
        # Request
        POST https://api.coinex.com/perpetual/v1/order/put_limit
        {
            "access_id" : "BFFA64957AA240F6BBEA26FXXXX",
            "market": "BTCUSD",    # 合约市场
            "price": "99.50",      # 委托价格
            "amount": "134.55",    # 委托数量
            "side": 1,             # 委托类型
            "effect_type": 1,      # 委托生效类型
            "time": 1550743431     # 客户端请求时间戳
        }

        # Response
        {
            "code": 0,
            "data": {
                "source": "API",
                "order_id": 281,
                "side": 1,
                "user_id": 12,
                "position_id": 0,
                "left": "10",
                "update_time": 1568187004.051227,
                "market": "BTCUSD",
                "effect_type": 1,
                "maker_fee": "0.00000",
                "position_type": 2,
                "deal_stock": "0",
                "create_time": 1568187004.051227,
                "target": 0,
                "type": 1,
                "price": "10090.0000",
                "taker_fee": "0.00075",
                "deal_profit": "0",
                "amount": "10",
                "deal_fee": "0",
                "leverage": "3"
            },
            "message": "ok"
        }
        """
        path = '/v2/futures/order'
        data = {
            'market': market,
            "market_type":market_type,
            "type": "limit",
            'side': side,
            'amount': str(amount),
            'price': str(price)
        }
        return self.request_client.post(path, data)
    def closeMarket(self,market,market_type="FUTURES"):
        path="/v2/futures/close-position"
        data = {
            'market': market,
            "market_type": market_type,
            "type" : "market"
        }  
        return self.request_client.post(path, data)      
    def pendingPosition(self,market,market_type="FUTURES"):
        path="/v2/futures/pending-position"
        data = {
            'market': market,
            "market_type": market_type,
        } 
        return self.request_client.get(path, data,sign=True)   
    def cancel_all_order(self, market,market_type="FUTURES"):
        """
        # Request
        POST https://api.coinex.com/perpetual/v1/order/cancel_all
        # Request.Body
        {
            "access_id" : "BFFA64957AA240F6BBEA26FXXXX",
            "market": "BTCUSD",   # 合约市场
            "tonce": 1550743431   # 客户端请求时间戳
        }

        # Response
        {
            "data": {
                "status": "success"
            },
            "code": 0,
            "message": "OK"
        }
        """
        path = '/v2/futures/cancel-all-order'
        params = {
            'market': market,
            "market_type" : market_type
        }
        return self.request_client.post(path, params)
    def query_order_pending(self, market, page, limit=100,market_type="FUTURES"):
        """
        # params:
            market	String	Yes	合约市场，例如BTCUSD, ALL：表示所有市场
            side	Integer	Yes	委托类型 0:全部(买与卖) 1:卖, 2: 买
            offset	Integer	Yes	偏移量，即从哪条开始获取
            limit	Integer	Yes	一次获取记录数，默认为20条，最大为100条

        # Request
        POST https://api.coinex.com/perpetual/v1/order/pending
        {
            'access_id': 'BFFA64957AA240F6BBEA26FXXXX',
            'market': 'BTCUSD',
            'side': 2,
            'offset': 0,
            'limit': 100,
            'time': 1550748047
        }

        # Response
        {
            "code": 0,
            "data": {
                "total": 1,   #返回数据的总条数
                "offset": 0,  #与请求字段的offset相同
                "limit": 100, #与请求字段的limit相同
                "records":
                [
                    {
                        "left": "10",
                        "amount": "10",
                        "leverage": "5",
                        "order_id": 1197,
                        "market": "BCHUSD",
                        "price": "150",
                        "deal_margin": "0",
                        "position_type": 1,
                        "position_id": 0,
                        "side": 1,
                        "update_time": 1550742670.491004,
                        "effect_type": 1,
                        "type": 1,
                        "user_id": 551,
                        "target": 0,
                        "maker_fee": "-0.0002",
                        "taker_fee": "0.0005",
                        "create_time": 1550742670.491004,
                        "source": "web",
                        "maiten_margin": "0.005",
                        "deal_stock": "0",
                        "deal_amount": "0",
                        "use_risklimit": "0.01432153",
                        "deal_fee": "0",
                        "risk_limit": "200",
                        "deal_price_avg": "0"
                    }
                ]
            }
            "message": "ok"
        }
        """
        path = '/v2/futures/pending-order'
        params = {
            'market': market,
            "market_type" :market_type,
            'page': page,
            'limit': limit
        }
        return self.request_client.get(path, params)
    def query_order_status(self, market, order_id):
        """
        # Request
        POST https://api.coinex.com/perpetual/v1/order/status
        {
            'access_id': 'BFFA64957AA240F6BBEA26FXXXX',
            'market': 'BTCUSD',
            'order_id': 2,
            'time': 1550748047
        }

        # Response
        {
            "code": 0,
            "data": {
                "user_id": 12,
                "deal_stock": "0",
                "order_id": 8397331,
                "target": 0,
                "position_id": 0,
                "update_time": 1569295003.825343,
                "create_time": 1569295003.825343,
                "price": "9988",
                "side": 2,
                "amount": "10",
                "market": "BTCUSD",
                "position_type": 2,
                "type": 1,
                "taker_fee": "0.00075",
                "effect_type": 1,
                "deal_profit": "0",
                "leverage": "3",
                "source": "API",
                "left": "10",
                "maker_fee": "-0.00025",
                "deal_fee": "0",
                "status": "not_deal"
            },
            "message": "OK"
        }
        """
        path = '/v2/futures/order-status'
        params = {
            'market': market,
            'order_id': order_id
        }
        return self.request_client.get(path, params)
    def cancel_order(self, market, order_id,market_type="FUTURES"):
        """
        # Request
        POST https://api.coinex.com/perpetual/v1/order/cancel
        # Request.Body
        {
            "access_id" : "BFFA64957AA240F6BBEA26FXXXX",
            "market": "BTCUSD",   # 合约市场
            "order_id": 1121,     # 订单ID
            "tonce": 1550743431   # 客户端请求时间戳
        }

        # Response
        {
            "code": 0,
            "data": {
                "source": "web",
                "order_id": 518,
                "side": 2,
                "user_id": 12,
                "position_id": 0,
                "left": "10",
                "update_time": 1568194210.967061,
                "market": "BTCUSD",
                "effect_type": 1,
                "maker_fee": "0.00000",
                "position_type": 2,
                "deal_stock": "0",
                "create_time": 1568194210.967061,
                "target": 0,
                "type": 1,
                "price": "8888.0000",
                "taker_fee": "0.00075",
                "deal_profit": "0",
                "amount": "10",
                "deal_fee": "0",
                "leverage": "3"
            },
            "message": "OK"
        }
        """
        path = '/v2/futures/cancel-order'
        params = {
            'market': market,
            "market_type" : market_type,
            'order_id': int(order_id) 
        }
        return self.request_client.post(path, params)


if __name__ == "__main__":
    access_id = ''
    secret_key = ''
    api = CoinexPerpetualApiV2(access_id, secret_key)
    print(api.ping())
