@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.
@REM ----------------------------------------------------------------------------
@ECHO OFF
SETLOCAL

SET "MAVEN_PROJECTBASEDIR=%~dp0."
SET "MAVEN_WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
SET "MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

IF NOT EXIST "%MAVEN_WRAPPER_JAR%" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$props=ConvertFrom-StringData ((Get-Content '%MAVEN_WRAPPER_PROPERTIES%' -Raw) -replace '\\','\\');" ^
    "$url=$props.wrapperUrl;" ^
    "New-Item -ItemType Directory -Force -Path (Split-Path '%MAVEN_WRAPPER_JAR%') | Out-Null;" ^
    "Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile '%MAVEN_WRAPPER_JAR%'"
)

java "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -classpath "%MAVEN_WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
