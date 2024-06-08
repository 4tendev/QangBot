from django import forms


class WithdrawForm(forms.Form):
    BTCAddress = forms.CharField(max_length=100, required=True)
    TOTPCode=forms.CharField( max_length=6, required=True)
