#!/usr/bin/python
# -*- coding: utf-8 -*-

import copy
import hashlib
import json
import logging
import requests
import time
import traceback
from eth_account import Account
from eth_account.messages import encode_defunct

class RequestClient(object):
    __headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
    }

    def __init__(self, smart_Contract_Wallet_Address  , sessionPublicKey ,sessionPrivateKey,proxy =None,  logger=None,):
        self.sessionPublicKey =sessionPublicKey
        self.sessionPrivateKey = sessionPrivateKey
        self.smart_Contract_Wallet_Address = smart_Contract_Wallet_Address
        self.headers = self.__headers
        self.host = 'https://api.lyra.finance'
        session = requests.Session()
        session.proxies = proxy
        session.mount('http://', requests.adapters.HTTPAdapter())
        session.mount('https://', requests.adapters.HTTPAdapter())
        self.http_client = session
        self.logger = logger or logging
    @staticmethod
    def get_sign( sessionPrivateKey ,message):
        account = Account.from_key(sessionPrivateKey)
        encoded_message = encode_defunct(text=message)
        signed_message = account.sign_message(encoded_message)
        return signed_message.signature.hex()

    def set_authorization(self, headers):
        timestamp = str(int(time.time() * 1000)) 
        headers['X-LyraWallet'] = self.smart_Contract_Wallet_Address
        headers['X-LyraTimestamp'] = timestamp
        headers['X-LyraSignature'] = self.get_sign( self.sessionPrivateKey , timestamp)

    def get(self, path, params=None, sign=True):
        url = self.host + path
        params = params or {}
        headers = copy.copy(self.headers)
        if sign:
            self.set_authorization( headers)
        try:
            response = self.http_client.get(
                url, params=params, headers=headers, timeout=5)
            # self.logger.info(response.request.url)
            if response.status_code == requests.codes.ok:
                return response.json()
            else:
                self.logger.error(
                    'URL: {0}\nSTATUS_CODE: {1}\nResponse: {2}'.format(
                        response.request.url,
                        response.status_code,
                        response.text
                    )
                )
                return None
        except Exception as ex:
            trace_info = traceback.format_exc()
            self.logger.error('GET {url} failed: \n{trace_info}'.format(
                url=url, trace_info=trace_info))
            return None

    def post(self, path, params=None):
        url = self.host + path
        headers = copy.copy(self.headers)
        self.set_authorization( headers)
        try:
            response = self.http_client.post(
                url,json=(params or {})  , headers=headers, timeout=10)
            # self.logger.info(response.request.url)
            if response.status_code == requests.codes.ok:
                return response.json()
            else:
                self.logger.error(
                    'URL: {0}\nSTATUS_CODE: {1}\nResponse: {2}'.format(
                        response.request.url,
                        response.status_code,
                        response.text
                    )
                )
                return None
        except Exception as ex:
            trace_info = traceback.format_exc()
            self.logger.error('POST {url} failed: \n{trace_info}'.format(
                url=url, trace_info=trace_info))
            return None
