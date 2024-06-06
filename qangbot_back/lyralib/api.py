from .request_client import RequestClient

class LyraApi(object):


    def __init__(self, smart_Contract_Wallet_Address, sessionPrivateKey, proxy =None):
        self.request_client = RequestClient(smart_Contract_Wallet_Address, sessionPrivateKey,proxy)

    # System API
    def subAccount(self,subAccountID):
        path = '/private/get_subaccount'
        params = {"subaccount_id": subAccountID}
        return self.request_client.post(path,params)