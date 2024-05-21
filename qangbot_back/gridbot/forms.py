from django import forms
from django.core.exceptions import ValidationError

class CreateBotForm(forms.Form):
    name = forms.CharField( max_length=20, required=True)
    contractID = forms.IntegerField( required=True)
    exchangeID = forms.IntegerField( required=True)
    accountID = forms.IntegerField( required=True)

class CreateCoinexAccountForm(forms.Form):
    access_ID=forms.CharField( max_length=50, required=True)
    secret_key=forms.CharField( max_length=50, required=True)
    name =forms.CharField( max_length=20, required=True)


class BotActions(forms.Form):
    CHOICES = [
        ("stop", "Stop"),
        ("resume", "Resume"),
    ]
    action=forms.ChoiceField( choices=CHOICES, required=True)


def grids_validator(value):
    required_keys=["sell" , "buy" , "nextPosition","size" ] 
    for grid in value :
        keys = grid.keys()
        for key in required_keys:
                if key not in keys:
                    raise ValidationError(f"The '{key}' is required.")
    for grid in value :
        for key in required_keys :
            try :
                if not float(grid[key])  >0 :
                    raise ValidationError(f"The '{key}' is not POSITIVE.")
            except :
                raise ValidationError(f"The '{key}' is not POSITIVE.")

class CreateGridsForm(forms.Form):
    grids=forms.JSONField(required=True , validators=[grids_validator])    