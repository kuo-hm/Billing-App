import io
from textwrap import wrap

import PyPDF2
from django.conf import settings
from docxtpl import DocxTemplate
from num2words import num2words
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfgen import canvas


def pdfGenerator(context,file_name):
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=letter)

    can.setFont('Times-Roman', 12)
    can.drawString(465, 618, context['date_time'])


    can.setFont('Times-Roman', 12)
    can.drawString(405, 538, context['client_name'])


    can.setFont('Times-Roman', 12)
    can.drawString(450, 520, context['client_id'])


    can.setFont('Times-Roman', 12)
    can.drawString(130, 466,context['object'])


    designation=context['designation']
    wraped_text = "\n".join(wrap(designation, 40))
    array_text=wraped_text.split('\n')
    t = can.beginText()
    t.setFont('Times-Roman', 10)
    y=425
    for line in array_text:
        y-=10
        t.setTextOrigin(100, y)
        t.textLine(line)
    can.drawText(t)

    can.setFont('Times-Roman', 12)
    can.drawString(270, 410, context['quntite'])

    can.setFont('Times-Roman', 12)
    can.drawString(340, 410, context['price'])

    can.setFont('Times-Roman', 12)
    can.drawString(450, 410, context['total_price'])


    can.setFont('Times-Roman', 11)
    can.drawString(450, 343, context['total_price'])

    can.setFont('Times-Roman', 11)
    can.drawString(450, 329, context['tva'])
    can.setFont('Times-Roman', 11)
    can.drawString(450, 315, context['ttc'])

    word=num2words(context['price_to_word'], lang='fr')
    can.setFont('Helvetica-Bold', 14)
    can.drawString(301, 226, word)

    can.save()

    #move to the beginning of the StringIO buffer
    packet.seek(0)

    # create a new PDF with Reportlab
    new_pdf = PyPDF2.PdfFileReader(packet)
    # read your existing PDF
    pdf_template=settings.MEDIA_ROOT/'facture_template.pdf'
    existing_pdf = PyPDF2.PdfFileReader(open(pdf_template, "rb"))
    output = PyPDF2.PdfFileWriter()
    # add the "watermark" (which is the new pdf) on the existing page
    page = existing_pdf.getPage(0)
    page.mergePage(new_pdf.getPage(0))
    output.addPage(page)
    # finally, write "output" to a real file
    outputStream = open(file_name, "wb")
    output.write(outputStream)
    outputStream.close()


def docxGenerator(context,file_name):
    docx_template = 'facture_template.docx'
    doc=DocxTemplate(settings.MEDIA_ROOT/docx_template)
    doc.render(context)
    doc.save(file_name)
