from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from accounts.api.serializers import RegistrationSerializer
from rest_framework.permissions import IsAuthenticated,  IsAdminUser
import random
import string
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from accounts.models import Hashed_code, Account
from passlib.hash import pbkdf2_sha256
import math
from rest_framework.views import APIView
from rest_framework import permissions


def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


@api_view(['POST', ])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            account = serializer.save()
            data['response'] = 'successfully registered new user.'
            data['email'] = account.email
            data['username'] = account.username
            data['first_name'] = account.first_name
            data['last_name'] = account.last_name
        else:
            data = serializer.errors
        return Response(data=data)


# @api_view(['POST', ])
@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def generate_code(request):
    if request.method == 'POST':
        code_gen = get_random_string(8)
        email = request.data['email']
        hashed_code = Hashed_code.objects.create(
            user_email=email, code=code_gen)
        hashed_code.save()
        return Response(code_gen)


def encrypt_password(pswd):
    encrypt_pswd = pbkdf2_sha256.encrypt(pswd, rounds=(
        int(math.pow(len(pswd), 3))), salt_size=(len(pswd)*2))
    return encrypt_pswd


def verify_password(pswd, e_pswd):
    return pbkdf2_sha256.verify(pswd, e_pswd)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payed(request):
    if request.method == 'POST':

        code = request.data['code']
        account = Account.objects.get(id=request.user.id)
        hashed_code = Hashed_code.check_code(
            code=code, user_email=account.email)
        if hashed_code:
            account.is_payed = True
            account.save()
            return Response(status=status.HTTP_202_ACCEPTED)

        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response(status=status.HTTP_401_UNAUTHORIZED)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['is_payed'] = user.is_payed
        token['check'] = user.is_admin
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})


def head(request):
    # print headers
    print(request.META)

    return HttpResponse(status=status.HTTP_200_OK)
