import datetime
from os import path, remove
from pathlib import Path

from accounts.api.customers_views import customer_by_id
from accounts.models import Account, Customer
from django.conf import settings
from django.core.files import File
from django.http import HttpResponse
from facturation.misc.email import email_send
from facturation.models import Devis, Facture
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from ..misc.filesGenerator import docxGenerator, pdfGenerator


########################################################################################
#                                                                                      #
#                             Add facture                                              #
#                                                                                      #
########################################################################################
@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_facture(request):
    try:
        
        temp_path = settings.MEDIA_ROOT/'temp_files'

        customer_id = request.data['customer_id']
        writer_email = request.data['writer_email']
        object=request.data.get('object')
        designation=request.data.get('designation')
        price=int(request.data.get('price'))
        quntity=int(request.data.get('quntity'))
        unit=request.data.get('unit')
        stat=request.data.get('status')
        cancellation_date=request.data.get('cancellation_date')
        total_price=price*quntity
        tva=total_price*0.2
        ttc=total_price+tva
        
        customer=Customer.objects.get(id=customer_id)
        writer=Account.objects.get(email=writer_email)
        
        context={'date_time': datetime.datetime.now().strftime('%d/%m/%Y'),'client_name':customer.company_name,'designation':designation,'object':'facture '+customer.company_name,
                 'quntite':str(quntity)+unit,'price':str(price)+'DH','total_price':str(total_price)+'DH','tva':str(tva)+'FH','ttc':str(ttc)+'DH','client_id':customer_id,
                 'price_to_word':ttc
            }

        file_name=customer.id+'-'+datetime.datetime.now().strftime('%d-%m-%Y-%H-%M-%S')
        
        docx_end=file_name+'.docx'
        pdf_end=file_name+'.pdf'
        
        temp_file_docx = temp_path/docx_end
        temp_file_pdf = temp_path/pdf_end        
        
        docxGenerator(context,temp_file_docx)
        pdfGenerator(context,temp_file_pdf)
    
        facture=Facture.objects.create(object=object,status=stat,designation=designation,prix=price,quantity=quntity,cancellation_date=cancellation_date,
                                       unit=unit,total_price=total_price,tva=tva,ttc=ttc,customer=customer,writer=writer,
                                        )
        
        docx_path = Path(temp_file_docx)
        pdf_path = Path(temp_file_pdf)

        with docx_path.open(mode='rb') as f:
            facture.facture_docx=File(f, name=docx_end)
            facture.save()
        
        with pdf_path.open(mode='rb') as f:
            facture.facture_pdf=File(f, name=pdf_end)
            facture.save()
            
        email_data={
            "email": Account.objects.get(customer=customer).email,
            "name": customer.company_name,
            "title": object,
            "tva": tva,
            "total": total_price,
        }
        
        
        email=email_send(email_data)
        
        email.attach(filename='facture', content=open(temp_file_pdf, 'rb').read(), mimetype='application/pdf')
        
        email=email.send()
        
        try:
            if email:
                facture.email_sent=True
                facture.sent_at=datetime.datetime.now()
                facture.save()
        except Exception as e:
            pass
        
        if path.exists(temp_file_docx):
            remove(temp_file_docx)
        
        if path.exists(temp_file_pdf):
            remove(temp_file_pdf)
        
        return Response(status=status.HTTP_201_CREATED)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    
    
########################################################################################
#                                                                                      #
#                             Devis to facture                                         #
#                                                                                      #
########################################################################################
@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def devi_to_facture(request):
    try:
        devi_id = request.data['devi_id']
        writer_email = request.data['writer_email']
        writer=Account.objects.get(email=writer_email)
        devis=Devis.objects.get(id=devi_id)
        cancellation_date=request.data.get('cancellation_date')
        facture=Facture.objects.create(object=devis.object,cancellation_date=cancellation_date,status=devis.status,designation=devis.designation,prix=devis.prix,quantity=devis.quantity,unit=devis.unit,total_price=devis.total_price,tva=devis.tva,ttc=devis.ttc,customer=devis.customer,writer=writer)
        facture.save()
        # devis.delete()
        content={'message':'Devis converti en facture'}
        return Response(content,status=status.HTTP_201_CREATED)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    
    

########################################################################################
#                                                                                      #
#                             Get all factures                                         #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def facture_fetch(request):
    try:
        facture=Facture.objects.order_by('-created_at').all()
        factures=[]
        for f in facture:
            factures.append({
            'id':f.id,
            'object':f.object,
            'payed_at':f.payed_at,
            'cancellation_date':f.cancellation_date.strftime('%d/%m/%Y'),
            'status':f.status,
            'email_sent':f.email_sent,
            'creation_date':f.created_at.strftime('%d/%m/%Y'),
            'customer':f.customer.company_name,
            'prix':f.total_price,
            
        })
        content={'factures':factures}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)

########################################################################################
#                                                                                      #
#                    Get all factures and sort them by months                          #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def all_facture_by_month(request):
    try:
        facture=Facture.objects.all()
        factures=[]
        for f in facture:
            factures.append({'id':f.id,'object':f.object,'created_at':f.created_at,'designation':f.designation,'prix':f.prix,'quantity':f.quantity,'unit':f.unit,'total_price':f.total_price,'tva':f.tva,'ttc':f.ttc,'customer':f.customer.company_name,'writer':f.writer.email,'status':f.status,'cancellation_date':f.cancellation_date})
        # filter factures by months
        factures_by_month={}
        price_by_status={}
        factures_by_status={}
        for f in factures:
            month=f['created_at'].strftime('%B')
            statu=f['status']
            if month in factures_by_month:
                if statu in factures_by_status:
                    
                    factures_by_status[statu].append(f)
                    
                else:
                    factures_by_status[statu]=[f]
                factures_by_month[month].append(factures_by_status[statu])
            else:
                if statu in factures_by_status:
                    factures_by_status[statu].append(f)
                else:
                    factures_by_status[statu]=[f]
                factures_by_month[month]=[f]

        content={'factures':factures_by_month,'factures_by_status_code':factures_by_status}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    
########################################################################################
#                                                                                      #
#                    Get all factures and sort them by years                           #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def all_facture_by_years(request):
    try:
        facture=Facture.objects.all()
        factures=[] 
        for f in facture:
            factures.append({'id':f.id,'object':f.object,'created_at':f.created_at,'designation':f.designation,'prix':f.prix,'quantity':f.quantity,'unit':f.unit,'total_price':f.total_price,'tva':f.tva,'ttc':f.ttc,'customer':f.customer.company_name,'writer':f.writer.email,'status':f.status,'cancellation_date':f.cancellation_date})
        # filter factures by years
        factures_by_years={}
        price_by_years={}
        for f in factures:
            year=f['created_at'].strftime('%Y')
            if year in factures_by_years:
                price_by_years[year]+=f['total_price']
                factures_by_years[year].append(f)

            else:   
                price_by_years[year]=f['total_price']
                factures_by_years[year]=[f]
        content={'factures':factures_by_years,'price_by_years':price_by_years}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    


########################################################################################
#                                                                                      #
#                             Change facture status                                    #
#                                                                                      #
########################################################################################
@api_view(['PUT', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def facture_status_change(request):
    try:
        facture_id = request.data['facture_id']
        status = request.data['status']
        facture=Facture.objects.get(id=facture_id)
        facture.status=status
        facture.updated_at=datetime.now()
        facture.save()
        content={'message':'Status changed'}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    


########################################################################################
#                                                                                      #
#                                Edit facture                                          #
#                                                                                      #
########################################################################################
@api_view(['PUT', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def edit_facture(request):
        temp_path = settings.MEDIA_ROOT/'temp_files'
        facture_id = request.data['id']
        facture=Facture.objects.get(id=facture_id)
        facture.object=request.data['object']
        facture.designation=request.data['designation']
        facture.prix=round(float(request.data['prix']),3)
        facture.quantity=request.data['quantity']
        facture.unit=request.data['unit']
        facture.total_price=round(float(request.data['prix']),3)*float(request.data['quantity'])
        facture.tva=round(float(facture.total_price),3)*0.2
        facture.ttc=round(float(facture.total_price),3)+round(float(facture.tva),3)
        if int(request.data['status'])==1:
            facture.payed_at=datetime.datetime.now()
        facture.status=request.data['status']
        facture.cancellation_date=request.data['cancellation_date']
        facture.updated_at=datetime.datetime.now()
        facture_pdf=facture.facture_pdf.path
        facture_docx=facture.facture_docx.path
        context={'date_time': datetime.datetime.now().strftime('%d/%m/%Y'),'client_name':facture.customer.company_name,'designation':facture.designation,'object':'facture '+facture.customer.company_name,
                 'quntite':str(facture.quantity)+facture.unit,'price':str(facture.prix)+'DH','total_price':str(facture.total_price)+'DH','tva':str(facture.tva)+'DH','ttc':str(facture.ttc)+'DH','client_id':facture.customer.id,
                 'price_to_word':facture.ttc
            }
        remove(temp_path/facture_pdf)

        remove(temp_path/facture_docx)
        docxGenerator(context,temp_path/facture_docx)
        pdfGenerator(context,temp_path/facture_pdf)
        
        facture.save()
        content={'message':'Facture edited'}
        return Response(content,status=status.HTTP_200_OK)
   


########################################################################################
#                                                                                      #
#                              Get factures by id                                      #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def facture_by_id(request,id):
    try:
        facture=Facture.objects.get(id=id)
        pdf=facture.facture_pdf

        content={'facture':{'id':facture.id,'object':facture.object,'created_at':facture.created_at,
                            'designation':facture.designation,'prix':facture.prix,'quantity':facture.quantity,
                            'unit':facture.unit,'total_price':facture.total_price,'tva':facture.tva,'ttc':facture.ttc,
                            'customer':facture.customer.company_name,'writer':facture.writer.email,'status':facture.status,
                            'cancellation_date':facture.cancellation_date,'email_sent':facture.email_sent,'email_sent_at':facture.email_sent,'facture_pdf':pdf.url}}
        # send pdf file from facture_pdf
    
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def facture_pdf_by_id(request,id):
    try:
        facture=Facture.objects.get(id=id)
        # send pdf file from facture_pdf
        pdf=facture.facture_pdf
        file_name=facture.object.replace(' ','')+'.pdf'
        response = HttpResponse(pdf.open(), content_type='application/pdf')
        response['Content-Disposition'] = 'inline;filename='+file_name
        return response
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
        



########################################################################################
#                                                                                      #
#                                   Send Email                                         #
#                                                                                      #
########################################################################################
@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def send_facture_email(request):
    try:
        facture_id = request.data['id']
        title = request.data['title']
        tva = request.data['tva']
        total_price = request.data['total']
        facture=Facture.objects.get(id=facture_id)
        customer=facture.customer
        customer_email=customer.customer_data.email
        email_data={
            "email": customer_email,
            "name": customer.company_name,
            "title": title,
            "tva": tva,
            "total": total_price,
        }
        email=email_send(email_data)
        email=email.send()
        if email:
            facture.email_sent=True
            facture.email_sent_at=datetime.datetime.now()
            facture.save()
            content={'message':'Email sent'}
            return Response(content,status=status.HTTP_200_OK)
        else:
            content={'message':'Email not sent'}
            return Response(content,status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
