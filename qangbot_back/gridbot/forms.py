from django import forms

class CreateBotForm(forms.Form):
    name = forms.CharField( max_length=20, required=True)
    contractID = forms.IntegerField( required=True)
    exchangeID = forms.IntegerField( required=True)
    accountID = forms.IntegerField( required=True)