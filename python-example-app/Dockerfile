FROM python:3.10-slim

RUN pip install pdm==2.4.7
RUN pdm config check_update false

WORKDIR /app
COPY pyproject.toml pdm.lock /app/
RUN mkdir __pypackages__ && pdm install --prod --no-lock --no-editable --no-self

COPY src/ /app/src
RUN pdm install --prod --no-lock --no-editable

ENV PATH "/app/__pypackages__/3.10/bin:$PATH"
ENV PYTHONPATH /app/__pypackages__/3.10/lib

CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "4001"]
