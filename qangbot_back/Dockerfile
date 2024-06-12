FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000


RUN echo "#!/bin/bash" >> startup.sh
RUN echo "python manage.py makemigrations" >> startup.sh
RUN echo "python manage.py migrate" >> startup.sh
RUN echo "gunicorn -b [::]:8000 core.wsgi:application" >> startup.sh
RUN chmod +x startup.sh

CMD ["./startup.sh"] 