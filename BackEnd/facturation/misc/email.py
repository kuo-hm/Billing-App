
# Create your views here.
import email
import math
import random
import string

from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.decorators import api_view


def email_send(data):
    # send email
    email=data['email']
    name=data['name']
    title=data['title']
    tva=data['tva']
    total=data['total']
    subject = 'Welcome to BeyondExpertise'
    message = render_to_string('email_template.html', {
        'name': name,
        'title': title,
        'tva': tva,
        'total': total,
    })
    email = EmailMessage(subject, message, to=[email])
    email.fail_silently = False
    return email
    
    
def reminder_email(data):
    email=data['email']
    name=data['name']
    invoice_number=data['invoice_number']

    subject = 'Welcome to BeyondExpertise'
    message = render_to_string('reminder_email_template.html', {
        'name': name,
        'invoice_number': invoice_number,
    })
    email = EmailMessage(subject, message, to=[email])
    email.fail_silently = False
    return email
