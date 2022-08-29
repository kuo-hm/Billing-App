# Create your views here.
import random
import string

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
# from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.api.serializers import (CustomerRegistrationSerializer,
                                      RegistrationSerializer)
from accounts.models import Account, Comment, Customer


def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def registration_view(request):
    try:
        if request.method == 'POST':
            serializer = RegistrationSerializer(data=request.data)
            data = {}
            if serializer.is_valid():
                account = serializer.save()
                data['response'] = 'successfully registered new user.'
                data['email'] = account.email
                data['username'] = account.username
                data['full_name'] = account.full_name
            else:
                data = serializer.errors
            
            return Response(data=data)
    except Exception as e:
        print(e)
        data = {'error': str(e)}
        return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def registration_customer_view(request):
    try:
        if request.method == 'POST':
            serializer = CustomerRegistrationSerializer(data=request.data)
            data = {}
            if serializer.is_valid():
                account = serializer.save(request.data)
                data['response'] = 'successfully registered new user.'
            else:
                data = serializer.errors
            return Response(data=data)
    except Exception as e:
        print(e)
        data = {'error': str(e)}
        return Response(data=data, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_comments(request):
    try:
        if request.method == 'GET':
            comments = Comment.objects.all()
            comment=[]
            for i in comments:
                com={}
                com['id']=i.id
                com['comment']=i.comment
                com['customer']=i.customer.company_name
                com['writer']=i.writer.full_name

                comment.append(com)
            return Response(data=comment)
    except Exception as e:
        print(e)
        data = {'error': str(e)}
        return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_comment(request,id):
    try:
        if request.method == 'POST':
            data=request.data
            customer=Customer.objects.filter(id=id).first()
            writer=Account.objects.get(id=data['user'])
            comment=Comment(comment=data['comment'],customer=customer,writer=writer)
            comment.save()
            return Response(data={'response':'comment added'})
    except Exception as e:
        print(e)
        data = {'error': str(e)}
        return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_comments_byid(request,id):
    try:
        if request.method == 'GET':
            comments = Comment.objects.filter(customer__id=id)
            comment=[]
            for i in comments:
                com={}
                com['id']=i.id
                com['comment']=i.comment
                com['customer']=i.customer.company_name
                com['writer']=i.writer.full_name

                comment.append(com)
            return Response(data=comment)
    except Exception as e:
        print(e)
        data = {'error': str(e)}
        return Response(data=data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_comment(request,id):
    try:
        if request.method == 'DELETE':
            comment=Comment.objects.filter(id=id)
            if comment.exists():
                comment.delete()
                return Response(data={'response':'comment deleted'})
            else:
                return Response(data={'response':'comment not found'})
    except Exception as e:
        print(e)
        data = {'error': str(e)}
        return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        
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


