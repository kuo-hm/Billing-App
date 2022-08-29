import datetime

from accounts.models import Customer
from facturation.models import Devis, Facture


def get_facture_by_month():
    factures = Facture.objects.filter(status=1).all()
    facture_by_month = { 'january':0,
        'february':0,
        'march':0,
        'april':0,
        'may':0,
        'june':0,
        'july':0,
        'august':0,
        'september':0,
        'october':0,
        'november':0,
        'december':0}
    for facture in factures:
        if facture.payed_at:
            if facture.payed_at.strftime('%B').lower() in facture_by_month:
                print(facture.payed_at.strftime('%B').lower())
                facture_by_month[facture.payed_at.strftime('%B').lower()] += 1
            else:
                facture_by_month[facture.payed_at.strftime('%B').lower()] = 1
    return facture_by_month

def get_devis_by_month():
    devis = Devis.objects.filter(status=2).all()
    devis_by_month = { 'january':0,
        'february':0,
        'march':0,
        'april':0,
        'may':0,
        'june':0,
        'july':0,
        'august':0,
        'september':0,
        'october':0,
        'november':0,
        'december':0}
    for devis in devis:
        if devis.validated_at.strftime('%B').lower() in devis_by_month:
            devis_by_month[devis.validated_at.strftime('%B').lower()] += 1
        else:
            devis_by_month[devis.validated_at.strftime('%B').lower()] = 1
    return devis_by_month

def devis_email_sent():
    devis=Devis.objects.filter(email_sent=True).all()
    devis_by_month={
        'january':0,
        'february':0,
        'march':0,
        'april':0,
        'may':0,
        'june':0,
        'july':0,
        'august':0,
        'september':0,
        'october':0,
        'november':0,
        'december':0
    }
    for devis in devis:
        if devis.validated_at:
            if devis.validated_at.strftime('%B').lower() in devis_by_month:
                devis_by_month[devis.validated_at.strftime('%B').lower()] += 1
            else:
                devis_by_month[devis.validated_at.strftime('%B').lower()] = 1
    return devis_by_month

def latest_month_total_facture():
    factures = Facture.objects.filter(status=1).all()
    # get total price of the last month only
    total_price = 0
    for facture in factures:
        if facture.payed_at:
            if facture.payed_at.strftime('%B') == datetime.datetime.now().strftime('%B'):
                total_price += facture.total_price
    return total_price


def facture_payed_this_month():
    factures = Facture.objects.all()
    this_month=datetime.datetime.now().strftime('%B')
    this_year=datetime.datetime.now().strftime('%Y')
    validated=0
    for facture in factures:
        if facture.status=='1' and facture.payed_at.strftime('%B')==this_month and facture.payed_at.strftime('%Y')==this_year:
            validated+=1
    return validated

def facture_email_sent_month():
    factures=Facture.objects.filter(email_sent=True).all()
    total_email_sent=0
    total_price=0
    for facture in factures:
        
        if facture.updated_at.strftime('%B') == datetime.datetime.now().strftime('%B'):
            total_price+=facture.total_price
            total_email_sent+=1
    email_this_month={
        'total_email_sent':total_email_sent,
        'total_price':total_price
    }
    return email_this_month


def facture_pie_chart():
    factures=Facture.objects.filter(status=2).all()
    one_week_off=0
    one_week_off_price=0
    one_month_off=0
    one_month_off_price=0
    for facture in factures:
        cancelation_date=datetime.date(facture.cancellation_date.year,facture.cancellation_date.month,facture.cancellation_date.day)
        todate_date=datetime.date(datetime.datetime.now().year,datetime.datetime.now().month,datetime.datetime.now().day)
        days=abs(cancelation_date-todate_date).days
        if days>=7:
            one_week_off+=1
            one_week_off_price+=facture.total_price
        if days>=30:
            one_month_off+=1
            one_month_off_price+=facture.total_price
    facture_cancelled_this_month={
        'week':{
            'total_facture':one_week_off,
            'total_price':one_week_off_price
        },
        'month':{
            'total_facture':one_month_off,
            'total_price':one_month_off_price
        },
        'email_sent':facture_email_sent_month()
    }
    return facture_cancelled_this_month

def devis_pie_chart():
    devis=Devis.objects.all()
    validated=0
    validated_price=0
    not_validated=0
    not_validated_price=0
    pending=0
    pending_price=0
    for devis in devis:
        if devis.status=='2':
            validated+=1
            validated_price+=devis.total_price
        if devis.status=='3':
            not_validated+=1
            not_validated_price+=devis.total_price
        if devis.status=='1':
            pending+=1
            pending_price+=devis.total_price
    devis_pie_chart={
        'validated':{
            'total_devis':validated,
            'total_price':validated_price
        },
        'not_validated':{
            'total_devis':not_validated,
            'total_price':not_validated_price
        },
        'pending':{
            'total_devis':pending,
            'total_price':pending_price
        }
    }
    return devis_pie_chart


def facture_by_last_added():
    factures=Facture.objects.order_by('-created_at').all()
    facture_by_last_added=[]
    for facture in factures:
        facture_by_last_added.append({
            'id':facture.id,
            'object':facture.object,
            'payed_at':facture.payed_at,
            'cancellation_date':facture.cancellation_date.strftime('%d/%m/%Y'),
            'status':facture.status,
            'email_sent':facture.email_sent,
            'creation_date':facture.created_at.strftime('%d/%m/%Y'),
            'customer':facture.customer.company_name,
            'prix':facture.total_price
        })
    return facture_by_last_added
