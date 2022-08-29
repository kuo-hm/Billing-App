import datetime
from os import path, remove
from pathlib import Path

from accounts.models import Account, Customer
from django.conf import settings
from django.core.files import File
from django.http import HttpResponse
from docxtpl import DocxTemplate
from facturation.misc.email import email_send
from facturation.misc.functions import devis_pie_chart
from facturation.models import Devis, Facture
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from ..misc.filesGenerator import docxGenerator, pdfGenerator


########################################################################################
#                                                                                      #
#                                 Add Devis                                            #
#                                                                                      #
########################################################################################
@api_view(['POST', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_devi(request):
    try:
        temp_path = settings.MEDIA_ROOT/'temp_files'

        docx_template = 'facture_template.docx'
        doc=DocxTemplate(settings.MEDIA_ROOT/docx_template)
        customer_id = request.data['customer_id']
        writer_email = request.data['writer_email']
        object=request.data.get('object')
        designation=request.data.get('designation')
        price=int(request.data.get('price'))
        quntity=int(request.data.get('quntity'))
        unit=request.data.get('unit')
        remainder_date=request.data.get('remainder_date')
        total_price=price*quntity
        tva=total_price*0.2
        ttc=total_price+tva
        customer=Customer.objects.get(id=customer_id)
        writer=Account.objects.get(email=writer_email)
        context={'date_time': datetime.datetime.now().strftime('%d/%m/%Y'),'client_name':customer.company_name,'designation':designation,'object':'devis '+customer.company_name,
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
    
        devis=Devis.objects.create(object=object,designation=designation,prix=price,quantity=quntity,remainder_date=remainder_date
                                   ,unit=unit,total_price=total_price,tva=tva,ttc=ttc,customer=customer,writer=writer)
        docx_path = Path(temp_file_docx)
        pdf_path = Path(temp_file_pdf)
        with docx_path.open(mode='rb') as f:
            devis.devis_docx=File(f, name=docx_end)
            devis.save()
        
        with pdf_path.open(mode='rb') as f:
            devis.devis_pdf=File(f, name=pdf_end)
            devis.save()
            

        email_data={
            "email": Account.objects.get(customer=customer).email,
            "name": customer.company_name,
            "title": object,
            "tva": tva,
            "total": total_price,
        }
        
        
        email=email_send(email_data)
        
        email.attach(filename='devis', content=open(temp_file_pdf, 'rb').read(), mimetype='application/pdf')
        
        email=email.send()
        
        try:
            if email:
                devis.email_sent=True
                devis.sent_at=datetime.datetime.now()
                devis.save()
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
#                              Get all Devis                                           #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def devis_fetch(request):
    try:
        devis=Devis.objects.all()
        devi=[]
        for d in devis:
            devi.append({
                  'id':d.id,
            'object':d.object,            'remainder_date':d.remainder_date.strftime('%d/%m/%Y'),
            'status':d.status,
            'email_sent':d.email_sent,
            'creation_date':d.created_at.strftime('%d/%m/%Y'),
            'customer':d.customer.company_name,
            })
        devis_chart=devis_pie_chart()
        content={'devis':devi,'devis_chart':devis_chart}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)


########################################################################################
#                                                                                      #
#                     Get all Devis and sort them by months                            #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def all_devis_by_month(request):
    try:
        devi=Devis.objects.all()
        devis=[]
        for f in devi:
            devis.append({'id':f.id,'object':f.object,'remainder_date':f.remainder_date,'designation':f.designation,'prix':f.prix,'quantity':f.quantity,'unit':f.unit,'total_price':f.total_price,'tva':f.tva,'ttc':f.ttc,'customer':f.customer.company_name,'writer':f.writer.email,'status':f.status})
        # filter devis by months
        devis_by_month={}
        devis_by_status={}
        for f in devis:
            month=f['remainder_date'].strftime('%B')
            statu=f['status']
            if month in devis_by_month:
                if statu in devis_by_status:
                    
                    devis_by_status[statu].append(f)
                    
                else:
                    devis_by_status[statu]=[f]
                devis_by_month[month].append(devis_by_status[statu])
            else:
                if statu in devis_by_status:
                    devis_by_status[statu].append(f)
                else:
                    devis_by_status[statu]=[f]
                devis_by_month[month]=[f]

        content={'devis':devis_by_month,'devis_by_status_code':devis_by_status}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    
    
    
########################################################################################
#                                                                                      #
#                      Get all Devis and sort them by years                            #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def all_devis_by_years(request):
    try:
        devi=Devis.objects.all()
        devis=[] 
        for f in devi:
            devis.append({'id':f.id,'object':f.object,'created_at':f.created_at,'designation':f.designation,'prix':f.prix,'quantity':f.quantity,'unit':f.unit,'total_price':f.total_price,'tva':f.tva,'ttc':f.ttc,'customer':f.customer.company_name,'writer':f.writer.email,'status':f.status})
        # filter devis by years
        devis_by_years={}
        price_by_years={}
        for f in devis:
            year=f['created_at'].strftime('%Y')
            if year in devis_by_years:
                price_by_years[year]+=f['total_price']
                devis_by_years[year].append(f)

            else:   
                price_by_years[year]=f['total_price']
                devis_by_years[year]=[f]
        content={'devis':devis_by_years,'price_by_years':price_by_years}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    
    
    
########################################################################################
#                                                                                      #
#                              Change devis status                                     #
#                                                                                      #
########################################################################################
@api_view(['PUT', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def devis_status_change(request):
    try:
        devis_id = request.data['devis_id']
        status = request.data['status']
        devis=Devis.objects.get(id=devis_id)
        devis.status=status
        devis.save()
        content={'message':'Status changed'}
        return Response(content,status=status.HTTP_200_OK)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    


########################################################################################
#                                                                                      #
#                                 Edit devis                                           #
#                                                                                      #
########################################################################################
@api_view(['PUT', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def edit_devis(request):
    # try:
        temp_path = settings.MEDIA_ROOT/'temp_files'
        
        devis_id = request.data['id']
        devis=Devis.objects.get(id=devis_id)
        devis.object=request.data['object']
        devis.designation=request.data['designation']
        devis.prix=round(float(request.data['prix']),3)
        devis.quantity=request.data['quantity']
        devis.unit=request.data['unit']
        devis.total_price=round(float(request.data['prix']),3)*float(request.data['quantity'])
        devis.tva=round(float(devis.total_price),3)*0.2
        devis.ttc=round(float(devis.total_price),3)+round(float(devis.tva),3)
        if int(request.data['status'])==2:
            devis.validated_at=datetime.datetime.now()
        devis.status=request.data['status']
        devis.remainder_date=request.data['remainder_date']
        devis_pdf=devis.devis_pdf.path
        devis_docx=devis.devis_docx.path
        context={'date_time': datetime.datetime.now().strftime('%d/%m/%Y'),'client_name':devis.customer.company_name,'designation':devis.designation,'object':'devis '+devis.customer.company_name,
                 'quntite':str(devis.quantity)+devis.unit,'price':str(devis.prix)+'DH','total_price':str(devis.total_price)+'DH','tva':str(devis.tva)+'DH','ttc':str(devis.ttc)+'DH','client_id':devis.customer.id,
                 'price_to_word':devis.ttc
            }
        remove(temp_path/devis_pdf)

        remove(temp_path/devis_docx)
        docxGenerator(context,temp_path/devis_docx)
        pdfGenerator(context,temp_path/devis_pdf)
        
        devis.save()
        content={'message':'devis edited'}
        return Response(content,status=status.HTTP_200_OK)
    # except Exception as e:
    #     content  = {'status':'error','message':str(e)}
    #     return Response(content,status=status.HTTP_400_BAD_REQUEST)



########################################################################################
#                                                                                      #
#                               Get devis by id                                        #
#                                                                                      #
########################################################################################
@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def devis_by_id(request,id):
    try:
        try:
            devis=Devis.objects.get(id=id)
            content={'devis':{'id':devis.id,'object':devis.object,
                              'remainder_date':devis.remainder_date,
                              'designation':devis.designation,'prix':devis.prix,
                              'quantity':devis.quantity,'unit':devis.unit,
                              'total_price':devis.total_price,'tva':devis.tva,
                              'ttc':devis.ttc,'customer':devis.customer.company_name,
                              'writer':devis.writer.email,'status':devis.status,
                              'remainder_date':devis.remainder_date,'email_sent':devis.email_sent,}}
            return Response(content,status=status.HTTP_200_OK)
        except Devis.DoesNotExist:
            content={'message':'devis not found'}
            return Response(content,status=status.HTTP_404_NOT_FOUND)
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
def send_devis_email(request):
    try:
        devis_id = request.data['id']
        title = request.data['title']
        tva = request.data['tva']
        total_price = request.data['total']
        devis=Devis.objects.get(id=devis_id)
        customer=devis.customer
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
            devis.email_sent=True
            devis.email_sent_at=datetime.datetime.now()
            devis.save()
            content={'message':'Email sent'}
            return Response(content,status=status.HTTP_200_OK)
        else:
            content={'message':'Email not sent'}
            return Response(content,status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, IsAdminUser])
def devis_pdf_by_id(request,id):
    try:
        devis=Devis.objects.get(id=id)
        # send pdf file from devis_pdf
        pdf=devis.devis_pdf
        file_name=devis.object.replace(' ','')+'.pdf'
        response = HttpResponse(pdf.open(), content_type='application/pdf')
        response['Content-Disposition'] = 'inline;filename='+file_name
        return response
    except Exception as e:
        content  = {'status':'error','message':str(e)}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
        