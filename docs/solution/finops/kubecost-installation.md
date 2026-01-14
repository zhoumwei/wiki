# Kubecost Installation Guide

> From: [Apptio Kubecost Install Instructions](https://www.apptio.com/products/kubecost/install-thankyou/)

Thank you for your interest in Kubecost. This guide will walk you through installing Kubecost into your Kubernetes cluster. The Kubecost Helm chart includes all dependencies to get up and running and takes only a few minutes to install.

## Prerequisites

Before you begin, ensure the following requirements are met:

- **Helm client** (version 3.1+) installed
- **Kubectl** installed  
- A **supported Kubernetes cluster** deployed

## Installation Steps

### Step 1: Install Kubecost

View install configuration options [here](https://www.apptio.com/products/kubecost/install-thankyou/).

```bash
helm install kubecost kubecost \
--repo https://kubecost.github.io/kubecost \
--set global.clusterId=someclustername \
--namespace kubecost --create-namespace
```

### Step 2: Enable Port-forward

```bash
kubectl port-forward --namespace kubecost deployment/kubecost-frontend 9090
```

> Having installation issues? View the [Troubleshoot Install](https://www.apptio.com/products/kubecost/install-thankyou/) guide.

### Step 3: Access the Dashboard

You can now view the deployed frontend by visiting:

[http://localhost:9090](http://localhost:9090)

Publish :9090 as a secure endpoint on your cluster to remove the need to port forward.

With this newfound visibility, teams often start with:
1. Looking at cost allocation trends
2. Searching for quick cost savings or reliability improvements

View the [Getting Started](https://www.apptio.com/products/kubecost/install-thankyou/) guide for more information on product configuration and common initial actions.

## Maintenance Operations

### Updating Kubecost

After installing Kubecost, you can update your version with:

```bash
helm repo add kubecost https://kubecost.github.io/kubecost/ && \
helm repo update && \
helm upgrade kubecost kubecost/kubecost -n kubecost
```

### Deleting Kubecost

To uninstall Kubecost and its dependencies:

```bash
helm uninstall kubecost -n kubecost
```

## Support

We're available any time for questions or concerns at:
- [Support Portal](https://www.apptio.com/products/kubecost/install-thankyou/)
- [Slack Community](https://www.apptio.com/products/kubecost/install-thankyou/) (invite)