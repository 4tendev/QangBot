import requests
import os

"This File need to change acording of you production enviroment"

def getDeploymentID(API_TOKEN, SERVICE_ID):
    try:
        API_ENDPOINT = "https://backboard.railway.app/graphql/v2"
        graphql_query = """
        query GetDeploymentsByServiceId($serviceId: String!) {
            deployments(input: { serviceId: $serviceId }) {
            edges {
                node {
                id
                status
                createdAt
                # Add more fields as needed
                }
            }
            }
        }
        """
        variables = {
            "serviceId": SERVICE_ID
        }
        headers = {
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": "application/json"
        }
        response = requests.post(API_ENDPOINT, json={
                                 "query": graphql_query, "variables": variables}, headers=headers)
        print(response)
        if response.status_code == 200:
            data = response.json()
            print(data)
            deployments = data.get("data", {}).get(
                "deployments", {}).get("edges", [])
            for deployment in deployments:
                deployment_node = deployment.get("node", {})
                deployment_id = deployment_node.get("id")
                status = deployment_node.get("status")
                if status == "SUCCESS":
                    return deployment_id
        else:
            print(
                f"Failed to retrieve deployments. Status code: {response.status_code}, Response: {response.text}")
        return None
    except Exception as e:
        print(e)
        return None


def restart():
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
