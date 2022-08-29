from accounts.models import Account, Customer
from facturation.misc.functions import (devis_email_sent, devis_pie_chart,
                                        facture_by_last_added,
                                        facture_payed_this_month,
                                        facture_pie_chart, get_devis_by_month,
                                        get_facture_by_month,
                                        latest_month_total_facture)
from facturation.models import Devis, Facture
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response


########################################################################################
#                                                                                      #
#                              Get home page                                           #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def home(request):
    try:
        if request.method == 'GET':
            factures=Facture.objects.filter(status=1).all()
            devis=Devis.objects.all()
            customers=Customer.objects.all()
            ca=0
            devis_valide=0
            total_devis=devis.count()
            for facture in factures:
                ca+=facture.total_price
            for devis in devis:
                if devis.status=='2':
                    devis_valide+=1
            line_graph_data={'devis_email_sent':devis_email_sent(),'devis_count_month':get_devis_by_month(), 'factures_count_month':get_facture_by_month()}
            data={
                'ca':ca,
                'devis_valide':devis_valide,
                'customers_count':customers.count(),
                'line_graph_data':line_graph_data,
                'total_devis':total_devis,
                'latest_month_total':latest_month_total_facture(),
                'devis_pie_chart':devis_pie_chart(),
                'facture_pie_chart':facture_pie_chart(),
                'facture_by_last_added':facture_by_last_added()
            }
            return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(e, status=status.HTTP_400_BAD_REQUEST)
