#!/usr/bin/python
# -*- coding: utf-8 -*-

import copy
import hashlib
import json
import logging
import requests
import time
import traceback
import hmac


class RequestClient(object):
    __headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
    }

    def __init__(self, access_id, secret_key, proxy=None, logger=None,):
        self.access_id = access_id
        self.secret_key = secret_key
        self.headers = self.__headers
        self.host = 'https://api.coinex.com'
        session = requests.Session()
        session.proxies = proxy
        session.mount('http://', requests.adapters.HTTPAdapter())
        session.mount('https://', requests.adapters.HTTPAdapter())
        self.http_client = session
        self.logger = logger or logging

    @staticmethod
    def get_sign(method, path, params, timestamp, secret_key):
        str_params = "?" + '&'.join(['='.join([str(k), str(v)])
                                     for k, v in params.items()]) if params else ""
        prepared_str = method + path + str_params+timestamp
        signed_str = hmac.new(bytes(secret_key, 'latin-1'), msg=bytes(
            prepared_str, 'latin-1'), digestmod=hashlib.sha256).hexdigest().lower()
        return signed_str

    def set_authorization(self,  method, path, params, headers):
        timestamp = str(int(time.time() * 1000))
        headers['X-COINEX-KEY'] = self.access_id
        headers['X-COINEX-SIGN'] = self.get_sign(
            method, path, params, timestamp, self.secret_key)
        headers["X-COINEX-TIMESTAMP"] = timestamp

    def get(self, path, params=None, sign=True):
        url = self.host + path
        params = params or {}
        headers = copy.copy(self.headers)
        if sign:
            self.set_authorization("GET", path, params, headers)
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

    def post(self, path, data=None):
        url = self.host + path
        data = data or {}
        headers = copy.copy(self.headers)
        self.set_authorization("POST", path, data, headers)
        try:
            response = self.http_client.post(
                url, data=data, headers=headers, timeout=10)
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
