# 该镜像需要依赖的基础镜像
FROM openjdk:8-jdk-alpine
# 指定维护者的名字
MAINTAINER pam
RUN apk --no-cache add curl
VOLUME /tmp
RUN echo "export LC_ALL=zh_CN.UTF-8"  >>  /etc/profile
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# 将当前目录下的jar包复制到docker容器的/目录下
ADD nft-market-backend-0.0.1-SNAPSHOT.jar app.jar
#RUN #bash -c 'touch /app.jar'

# 指定docker容器启动时运行jar包
ENTRYPOINT ["java","-jar","-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=12345","/app.jar"]

EXPOSE 8080