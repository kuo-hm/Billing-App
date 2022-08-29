FROM ubuntu:22.10
# Install cron
RUN apt-get update && apt-get -y install cron && apt-get -y install pip
# Create the log file to be able to run tail
RUN touch /var/log/cron.log
# Setup cron job
# Run the command on container startup
CMD service cron start && cron && tail -f /var/log/cron.log
RUN apt-get -y install libpython2.7 libpython2.7-dev libpq-dev python3-pip

# RUN apt-get -y install postgresql
WORKDIR /usr/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /usr/app/requirements.txt
RUN pip3 install -r requirements.txt