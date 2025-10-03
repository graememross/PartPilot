#!/bin/bash
# This script sets the permissions for the Docker socket to allow non-root users to access it.
# It should be run after the container is created.

#sudo chown root:1000 /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock

# Check to see if the postgres database has been started
# If it has, then we can run the setup script to create the database and user
# If it hasn't, then we wait and check again

cd /workspaces/PartPilot
docker compose up postgres -d
result=1
while [ $result == "running" ]; do
    echo "Postgres container not started yet. Waiting..."
    result = $(docker inspect partpilot-postgres-1 | jq -r .[0].State.Status )
    sleep 2
done
data=$(docker inspect partpilot-postgres-1)

DNSNAME=$(echo $data | jq -r '.[0].NetworkSettings.Networks["partpilot_default"].Aliases[0]')
echo "Postgres container started with DNS name: $DNSNAME"
IPADDRESS=$(echo $data | jq -r '.[0].NetworkSettings.Networks["partpilot_default"].IPAddress')
echo "Postgres container started with IP address: $IPADDRESS"

grep -v $DNSNAME /etc/hosts | sudo tee /etc/hosts
sudo bash -c "echo $IPADDRESS $DNSNAME >> /etc/hosts; cat /etc/hosts"
echo "Added $IPADDRESS $DNSNAME to /etc/hosts"

