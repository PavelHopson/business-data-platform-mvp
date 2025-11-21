FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    cron \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/scripts/run_etl.sh
RUN chmod +x /app/load_fns_data.py
RUN chmod +x /app/etl_scripts/insert_real_data_from_json.py
RUN chmod +x /app/scripts/health_check.py
RUN chmod +x /app/scripts/api_monitor.py

COPY crontab /etc/cron.d/etl-cron
RUN chmod 0644 /etc/cron.d/etl-cron
RUN crontab /etc/cron.d/etl-cron

RUN touch /var/log/cron.log

CMD ["sh", "-c", "python scripts/metrics_server.py & cron && tail -f /var/log/cron.log"]
