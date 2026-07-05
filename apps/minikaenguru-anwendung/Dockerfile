FROM registry.access.redhat.com/ubi9/openjdk-21-runtime:1.22

ENV LANG='de_DE.UTF-8' LANGUAGE='de_DE:de'

USER root
RUN echo "quarkus:x:1001:0:Quarkus:/home/quarkus:/sbin/nologin" >> /etc/passwd
RUN mkdir -p /deployments/logs \
    && chown -R 1001:0 /deployments/logs

USER 1001

# We make four distinct layers so if there are application changes the library layers can be re-used
COPY --chown=1001 quarkus-app/lib/ /deployments/lib/
COPY --chown=1001 quarkus-app/*.jar /deployments/
COPY --chown=1001 quarkus-app/app/ /deployments/app/
COPY --chown=1001 quarkus-app/quarkus/ /deployments/quarkus/

WORKDIR /deployments

COPY --chown=1001 .env /deployments

ENV AB_JOLOKIA_OFF=""
ENV JAVA_OPTIONS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager -Dfile.encoding=UTF8 -XshowSettings:vm -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/quarkus"
ENV JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF8
ENV TZ=Europe/Berlin
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"