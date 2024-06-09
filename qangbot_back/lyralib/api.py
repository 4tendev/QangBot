from .request_client import RequestClient
import time ,json
import random
from eth_account import Account
from eth_account.messages import encode_defunct


def generate_unix_timestamp_with_expiry():
    current_time = int(time.time())
    min_expiry = 60 * 60 * 24 * 365
    expiry = current_time + min_expiry
    return expiry


def generate_nonce():
    timestamp_ms = int(round(time.time() * 1000))
    random_number = random.randint(0, 999999)
    nonce = str(timestamp_ms) + str(random_number).zfill(6)
    return int(nonce)


class LyraApi(object):
    ORDER_DIRECTION_SELL = "sell"
    ORDER_DIRECTION_BUY = "buy"

    def __init__(self, smart_Contract_Wallet_Address, sessionPublicKey, sessionPrivateKey, proxy=None):
        self.request_client = RequestClient(
            smart_Contract_Wallet_Address, sessionPublicKey, sessionPrivateKey, proxy)

    # System API
    def subAccount(self,subAccountID):
        path = '/private/get_subaccount'
        params = {"subaccount_id": subAccountID}
        return self.request_client.post(path, params)
'''
    def put_limit_order(self, instrument_name, direction, amount, limit_price):
        path = "/private/order_debug"
        nonce = generate_nonce()
        signature_expiry_sec = generate_unix_timestamp_with_expiry()
        params = {"amount": amount, "nonce": nonce, "limit_price": limit_price, "direction": direction, "subaccount_id":  self.request_client.subAccountID,
                  "instrument_name": instrument_name, "signer": self.request_client.sessionPublicKey, "signature_expiry_sec": signature_expiry_sec ,'max_fee' :0, }
        encoded_message = encode_defunct(text=   json.dumps(params))
        account = Account.from_key(self.request_client.sessionPrivateKey)
        signature  = account.sign_message(encoded_message).signature.hex()
        params["signature"]= signature
        return self.request_client.post(path, params)
'''