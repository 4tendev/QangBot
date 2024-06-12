from .request_client import RequestClient

from random import randint
from eip712_structs import EIP712Struct, Address, Uint, Boolean, make_domain
from web3 import Web3 
from eth_account import Account
import time


class AevoApi(object):


    def __init__(self, API_Key, API_Secret, Signing_Key, proxy=None):
        self.Signing_Key =Signing_Key
        self.request_client = RequestClient(
            API_Key, API_Secret, proxy)

    # System API
    def account(self):
        path = '/account'
        return self.request_client.get(path, None , sign=True)
    
    def allOpenOrders(self) :
        path ="/orders"
        return self.request_client.get(path, None , sign=True)
    
    def cancelOrder(self ,order_id) :
        path =f"/orders/{order_id}"
        params = { "order_id" :order_id   }
        return self.request_client.delete(path, params )  
      
    def order(self ,order_id) :
        path =f"/orders/{order_id}"
        return self.request_client.get(path,None ,sign=True )  

    def market(self,name)  :
        path= f"/instrument/{name}"
        return self.request_client.get(path, None ) 
    

    def cancelOrders(self ,instrument_type,asset ) :
        path =f"/orders-all"
        params = { "instrument_type" :instrument_type ,"asset" : asset   }
        return self.request_client.delete(path, params )      

    def positions(self):
        path ="/positions"
        return self.request_client.get(path,None ,True ) 
    
    def createOrder(self ,instrument , is_buy,amount, limit_price, maker )  :
        instrument = int(instrument)
        salt = randint(0, 10**6)
        timestamp = time.time_ns()
        unix_timestamp = int(timestamp / 1e9) 
        decimals = 10**6
        amount = int(amount * decimals)
        limit_price = int(limit_price * decimals)
        class Order(EIP712Struct):
            maker = Address()
            isBuy = Boolean()
            limitPrice = Uint(256)
            amount = Uint(256)
            salt = Uint(256)
            instrument = Uint(256)
            timestamp = Uint(256)
        order_struct = Order(maker=maker, # The wallet's main address
                            isBuy=is_buy, # True if buy, False if sell
                            limitPrice=limit_price,
                            amount=amount,
                            salt=salt,
                            instrument=instrument,
                            timestamp=unix_timestamp)
        domain = make_domain(name="Aevo Mainnet", version="1", chainId=1)
        # Testnet Domain
        #domain = make_domain(name='Aevo Testnet', version='1', chainId=11155111)
        signable_bytes = Web3.keccak(order_struct.signable_bytes(domain=domain)) 
        key = self.Signing_Key
        signature = Account._sign_hash(signable_bytes, key).signature.hex()   
        path ="/orders"   
        params= {  
            "instrument" : instrument,
            "is_buy": is_buy,
            "amount" : amount,
            "limit_price" : limit_price,
            "maker" : maker,
            "signature" : signature,
            "timestamp" : unix_timestamp,
             "salt": salt
        }
        return self.request_client.post(path, timestamp, params  )  