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

import hmac


class RequestClient(object):
    __headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
    }

    def __init__(self, API_Key, API_Secret, proxy=None,  logger=None,):
        self.API_Key = API_Key
        self.API_Secret = API_Secret
        self.headers = self.__headers
        self.host = 'https://api.aevo.xyz'
        session = requests.Session()
        session.proxies = proxy
        session.mount('http://', requests.adapters.HTTPAdapter())
        session.mount('https://', requests.adapters.HTTPAdapter())
        self.http_client = session
        self.logger = logger or logging

    def get_signature(self, timestamp, path, method, body):

        concat = f"{self.API_Key},{timestamp},{method.upper()},{path},{body}".encode(
            "utf-8")
        signature = hmac.new(self.API_Secret.encode(
            "utf-8"), concat, hashlib.sha256).hexdigest()

        return signature

    def set_authorization(self, timestamp, path, method, body, headers):

        headers["AEVO-TIMESTAMP"] = timestamp
        headers['AEVO-SIGNATURE'] = self.get_signature(
            timestamp, path, method, body)
        headers["AEVO-KEY"] = self.API_Key

    def get(self, path, params=None, sign=True):
        timestamp = str(time.time_ns())
        url = self.host + path
        paramsForHeader = json.dumps(params) if params else ""
        params = params or {}
        headers = copy.copy(self.headers)
        if sign:
            self.set_authorization(
                timestamp, path, "GET", paramsForHeader, headers)
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

    def post(self, path, timestamp,params=None ,):
        timestamp = str(timestamp)
        url = self.host + path
        headers = copy.copy(self.headers)
        paramsForHeader = json.dumps(params) if params else ""
        self.set_authorization(
                timestamp, path, "POST", paramsForHeader, headers)
        try:
            response = self.http_client.post(
                url, json=(params or {}), headers=headers, timeout=10)
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
    
    def delete(self, path, params=None):
        timestamp = str(time.time_ns())
        url = self.host + path
        paramsForHeader = json.dumps(params) if params else ""
        params = params or {}
        headers = copy.copy(self.headers)
        self.set_authorization(
                timestamp, path, "DELETE", paramsForHeader, headers)        
        try:
            response = self.http_client.delete(
                url, json=params, headers=headers, timeout=5)
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
                return response.json()
        except Exception as ex:
            trace_info = traceback.format_exc()
            self.logger.error('GET {url} failed: \n{trace_info}'.format(
                url=url, trace_info=trace_info))
            return None        