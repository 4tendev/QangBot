import requests
import os
from .getDeploymentID import getDeploymentID


def redeploy():
    API_TOKEN = os.getenv("API_TOKEN")
    SERVICE_ID = os.getenv("SERVICE_ID")
    deployment_id = getDeploymentID(API_TOKEN, SERVICE_ID)
    if not deployment_id:
        return None
    query = """
    mutation deploymentRedeploy($id: String!) {
    deploymentRedeploy(id: $id) {
        __typename
        canRedeploy
        canRollback
        createdAt
        environmentId
        id
        meta
        projectId
        serviceId
        snapshotId
        staticUrl
        status
        suggestAddServiceDomain
        url
    }
    }
    """
    variables = {
        "id": deployment_id
    }
    payload = {
        "query": query,
        "variables": variables
    }
    endpoint = "https://backboard.railway.app/graphql/v2"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.post(endpoint, json=payload, headers=headers)
    print(response.json())
    return True
