from django import forms




class LoginForm(forms.Form):
    username=forms.CharField(max_length=50, required=True)
    password=forms.CharField(max_length=100,required=True)
    TOTPCode=forms.CharField(required=False)

class RegisterForm(forms.Form):
    username=forms.CharField(max_length=50,min_length=6, required=True)
    password=forms.CharField(max_length=100,min_length=8,required=True)
    email=forms.EmailField(required=True)
    verificationCode=forms.CharField(required=False)

class ResetPasswordForm(forms.Form):
    email=forms.EmailField(required=True)
    newPassword=forms.CharField(max_length=100,min_length=8,required=False)
    verificationCode=forms.CharField(required=False)    