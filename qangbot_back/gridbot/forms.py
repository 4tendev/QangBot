from django import forms

class CreateBotForm(forms.Form):
    name = forms.CharField( max_length=20, required=True)
    contractID = forms.IntegerField( required=True)
    exchangeID = forms.IntegerField( required=True)
    accountID = forms.IntegerField( required=True)

class CreateCoinexAccountForm(forms.Form):
    access_ID=forms.CharField( max_length=50, required=True)
    secret_key=forms.CharField( max_length=50, required=True)
    name =forms.CharField( max_length=20, required=True)