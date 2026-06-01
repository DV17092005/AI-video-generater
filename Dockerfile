FROM python:3.14-slim

WORKDIR /app

COPY AmazonQ_generate_suggestion.py /app

RUN python -m compileall AmazonQ_generate_suggestion.py

ENTRYPOINT ["python", "AmazonQ_generate_suggestion.py"]
