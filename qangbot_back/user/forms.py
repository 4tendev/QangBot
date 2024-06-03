from django import forms


emailCodeField = forms.CharField(required=False)
trustedDeviceField = forms.BooleanField(required=False)
emailField = forms.EmailField(required=True)
passwordField = forms.CharField(max_length=100, min_length=8, required=True)


class LoginForm(forms.Form):
    email = emailField
    password = passwordField
    TOTPCode = forms.CharField(required=False)
    emailCode = emailCodeField
    trustedDevice = trustedDeviceField


class RegisterForm(forms.Form):
    password = passwordField
    email = emailField
    emailCode = emailCodeField
    trustedDevice = trustedDeviceField


class ResetPasswordForm(forms.Form):
    email = emailField
    newPassword = forms.CharField(max_length=100, min_length=8, required=False)
    emailCode = emailCodeField

class ChangePasswordForm(forms.Form):
    password = passwordField
    newPassword = forms.CharField(max_length=100, min_length=8, required=False)

class CheckPaidForm(forms.Form):
    address=forms.CharField( required=True)