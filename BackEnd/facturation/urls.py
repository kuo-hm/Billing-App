from pathlib import Path

from django.urls import path

from .views import devis, facture, home

urlpatterns = [
    #Facture
    path('send/facture-email', facture.send_facture_email , name='send email'),
    path('fetch/facture', facture.facture_fetch , name='fetch facture'),
    path('edit/facture', facture.edit_facture , name='edit facture'),
    path('fetch/facture/<str:id>', facture.facture_by_id , name='fetch facture'),
    path('add/facture', facture.add_facture , name='add facture'),
    path('devi/to/facture', facture.devi_to_facture , name='devi to facture'),
    path('fetch_by_month', facture.all_facture_by_month , name='fetch facture by month'),
    path('fetch_by_years', facture.all_facture_by_years , name='fetch facture by years'),
    path('fetch/facture/pdf/<str:id>', facture.facture_pdf_by_id , name='fetch facture pdf'),
    
    #Devis
    path('fetch/devi/<str:id>', devis.devis_by_id , name='fetch devis'),
    path('add/devi', devis.add_devi , name='add devi'),
    path('edit/devi', devis.edit_devis , name='edit devis'),
    path('fetch/devi', devis.devis_fetch , name='fetch devis7'),
    path('send/devis-email', devis.send_devis_email , name='send email'),
    path('fetch/devis/pdf/<str:id>', devis.devis_pdf_by_id , name='fetch devis pdf'),
    
    #home
    path('fetch/home', home.home , name='add devi'),
]
