FROM rabbitmq:3.10-management-alpine

COPY rabbitmq_delayed_message_exchange-3.10.2.ez /plugins
RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange