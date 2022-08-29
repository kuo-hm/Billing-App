import random
import string

from accounts.api.serializers import RegistrationSerializer
from accounts.models import Account, Comment, Customer
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from facturation.models import Devis, Facture
from passlib.hash import pbkdf2_sha256
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated, IsAdminUser])
def all_customers(request):
    if request.method == "GET":
        customers = Customer.objects.all()
        customers_array = []
        for customer in customers:
            account = Account.objects.get(customer_detail=customer)
            customer_dict = {
                "id": customer.id,
                "company_name": customer.company_name,
                "email": account.email,
                "phone": customer.phone,
                "address": customer.address,
                "city": customer.city,
                "country": customer.country,
                "country": customer.country,
            }
            customers_array.append(customer_dict)
        return Response(customers_array)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated, IsAdminUser])
def customer_by_id(request, id):
    if request.method == "GET":
        customer = Customer.objects.get(id=id)
        account = Account.objects.get(customer_detail=customer)
        comments = Comment.objects.filter(customer=customer)
        comments_array = []
        customer_dict = {
            "id": customer.id,
            "company_name": customer.company_name,
            "email": account.email,
            "phone": customer.phone,
            "address": customer.address,
            "city": customer.city,
            "country": customer.country,
            "type": customer.type,
        }
        for comment in comments:
            comment_dict = {
                "id": comment.id,
                "comment": comment.comment,
                "customer": comment.customer.company_name,
                "writer": comment.writer.email,
                "created_at": comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": comment.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            comments_array.append(comment_dict)
        customer_dict["comments"] = comments_array
        return Response(customer_dict)

@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated, IsAdminUser])
def customer_data_by_id(request, id):
    try:
        if request.method == "GET":
            customer = Customer.objects.get(id=id)
            factures = Facture.objects.filter(customer=customer).all()
            devis = Devis.objects.filter(customer=customer).all()
            facture_array = []
            devis_array = []
            ca = 0
            for f in factures:
                ca += f.total_price
            for f in factures:
                facture_array.append(
                    {
                        "id": f.id,
                        "object": f.object,
                        "payed_at": f.payed_at,
                        "cancellation_date": f.cancellation_date.strftime("%d/%m/%Y"),
                        "status": f.status,
                        "email_sent": f.email_sent,
                        "creation_date": f.created_at.strftime("%d/%m/%Y"),
                        "customer": f.customer.company_name,
                        "prix": f.total_price,
                    }
                )
            for d in devis:
                devis_array.append(
                    {
                        "id": d.id,
                        "object": d.object,
                        "remainder_date": d.remainder_date.strftime("%d/%m/%Y"),
                        "status": d.status,
                        "email_sent": d.email_sent,
                        "creation_date": d.created_at.strftime("%d/%m/%Y"),
                        "customer": d.customer.company_name,
                    }
                )
            data = {
                "ca": ca,
                "factures": facture_array,
                "devis": devis_array,
            }
            return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)
