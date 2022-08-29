from django.urls import path
from accounts.api.views import (registration_view)

from rest_framework_simplejwt.views import (

    TokenRefreshView,
)

from accounts.api.views import MyTokenObtainPairView, generate_code, payed, head
from accounts.api.views import GetCSRFToken


app_name = 'accounts'

urlpatterns = [
    path('register', registration_view, name='register'),
    path('token', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('gen_code', generate_code, name='code'),
    path('payed_check', payed, name='payed'),
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('head', head, name='head')


]
