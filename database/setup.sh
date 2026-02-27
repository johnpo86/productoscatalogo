#!/bin/bash

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to be ready..."
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P $MSSQL_SA_PASSWORD -C -Q "SELECT 1" > /dev/null 2>&1
while [ $? -ne 0 ]; do
    sleep 2
    /opt/mssql-tools18/bin/sqlcmd -S db -U sa -P $MSSQL_SA_PASSWORD -C -Q "SELECT 1" > /dev/null 2>&1
done

echo "SQL Server is ready. Running init script..."
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P $MSSQL_SA_PASSWORD -d master -i /usr/src/app/init.sql -C

echo "Database setup complete."
