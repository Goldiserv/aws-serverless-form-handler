@echo off
aws dynamodb query ^
  --table-name MyDbName ^
  --key-condition-expression "formSourceId = :formSourceId and timeAndRequestId > :requestDate" ^
  --expression-attribute-values file://expression-attributes.json ^
  --region ap-southeast-1
pause
:: --filter-expression "requestDate > :requestDate"