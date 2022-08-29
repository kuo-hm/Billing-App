import email
import os
from math import remainder

from django.db import models

# Create your models here.

def facturation_upload_path(instance, filename):
    if filename.endswith('.pdf'):
        return os.path.join('facturation',str(instance.customer.company_name), 'pdf', filename)
    else:
        return os.path.join('facturation', str(instance.customer.company_name),'docx', filename)
def devis_upload_path(instance, filename):
    if filename.endswith('.pdf'):
        return os.path.join('devis',str(instance.customer.company_name), 'pdf', filename)
    else:
        return os.path.join('devis', str(instance.customer.company_name),'docx', filename)
class BaseModelInvoice(models.Model):

    object=models.TextField(default='')
    designation=models.TextField(default='')
    prix=models.FloatField(default=0)
    quantity=models.IntegerField(default=0)
    unit=models.TextField(default='')
    total_price=models.FloatField(default=0)
    tva=models.FloatField(default=0)
    ttc=models.FloatField(default=0)
    email_sent=models.BooleanField(default=False)
    customer=models.ForeignKey('accounts.Customer', on_delete=models.CASCADE)
    writer=models.ForeignKey('accounts.Account', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sent_at = models.DateTimeField(auto_now=False, auto_now_add=False, null=True, blank=True)
    remider_sent = models.BooleanField(default=False)
    def __str__(self):
        return self.object

class Devis(BaseModelInvoice):
    class Types(models.TextChoices):
        encours = '1','En cours'
        valide = '2','Validé'
        notvalide = '3','non validé'
    
    status=models.TextField(max_length=1,choices =Types.choices,default=Types.encours)
    validated_at=models.DateTimeField(null=True,blank=True)
    
    devis_pdf=models.FileField(upload_to=devis_upload_path,null=True,blank=True)
    devis_docx=models.FileField(upload_to=devis_upload_path,null=True,blank=True)
    remainder_date=models.DateField(default='')

class Facture(BaseModelInvoice):
    class Types(models.TextChoices):
        payed = '1','Payé'
        notpayed = '2','Non payé'
    status=models.TextField(max_length=1,choices =Types.choices,default=Types.notpayed)
    payed_at=models.DateTimeField(null=True,blank=True)
    cancellation_date=models.DateField(default='')
    facture_pdf=models.FileField(null=True,blank=True,upload_to=facturation_upload_path) 
    facture_docx=models.FileField(null=True,blank=True,upload_to=facturation_upload_path)
    
