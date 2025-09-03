FROM python:3.11-slim
LABEL authors="ibunceski"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python resource_management_app/manage.py collectstatic --noinput || true

CMD ["python", "resource_management_app/manage.py", "runserver", "0.0.0.0:8000"]
