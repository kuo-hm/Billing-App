from datetime import date, timedelta

from django.core.management.base import BaseCommand
from facturation.misc.email import reminder_email
from facturation.models import Devis, Facture


class Command(BaseCommand):
    def handle(self, *args, **kwargs):

        print('Creating reminder for factures')
        today = date.today()

        facture_expired = Facture.objects.filter(remider_sent=False)
        devis_expired = Devis.objects.filter(remider_sent=False)
        
        for facture in facture_expired:
            if facture.remider_sent == False:
                if facture.cancellation_date >= today:
                    
                    data={
                        'email':facture.customer.customer_data.email,
                        'invoice_number':facture.id,
                        'name':facture.customer.company_name,
                    }
                    
                    email=reminder_email(data)
                    email=email.send()
                    try:
                        if email:
                            facture.remider_sent = True
                            facture.save()
                            print("Facture {} has been sent".format(facture.id))
                    except Exception as e:
                        print(e)

        for devis in devis_expired:
            if devis.remider_sent == False:
                if devis.remainder_date >= today:
                    
                    data={
                        'email':devis.customer.customer_data.email,
                        'devis_number':devis.id,
                        'name':devis.customer.company_name,
                    }
                    
                    email=reminder_email(data)
                    email=email.send()
                    try:
                        if email:
                            devis.remider_sent = True
                            devis.save()
                            print("Devis {} has been sent".format(devis.id))
                    except Exception as e:
                        print(e)
