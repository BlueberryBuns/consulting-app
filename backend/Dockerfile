FROM python:3.9
ENV PYTHONUNBUFFERED=1
WORKDIR /backend
COPY requirements.txt /backend/requirements.txt
RUN pip3 install -r requirements.txt
COPY . /backend/