# GradeBook Web App

GradeBook is a Synergy StudentVUE interface that looks real fancy. Synergy, I'm sure we can all agree, is not the greatest, so GradeBook has sought to improve its interface and its experience.

Gradebook is an application that is currently run on a Kubernetes cluster hosted on DigitalOcean. We use the latest industry standard security practices to ensure your information stays safe. HTTPS and HSTS is used to encrypt all information transfered between the user's computer and Edupoint's servers.

Our service stores metadata for every user to make the user experience smoother. We do NOT, however, store any information about grades or classes, and such information is not available to us.

## NPM Dependencies

1.  **@team-llambda/gradebook-api** == 1.1.0
2.  **chart.js** >= 2.7.3
3.  **moment** >= 2.23.0
4.  **react** >= 16.4.2
5.  **react-chartjs-2** >= 2.7.4
6.  **react-dom** >= 16.4.2
7.  **react-notifications** >= 1.4.3
8.  **react-router-dom** >= 4.3.1
9.  **react-scripts** >= 2.1.3
10. **socket.io-client** >= 2.1.1

## How to run

This repository contains the React frontend application. Thus, to run it on your own system, you must first satisfy several prerequisites. Keep in mind that the app, when run on your machine, will not have the full range of features as our hosted version, as our servers may withhold certain features from frontend apps that are not hosted by us.

### Prerequisites

1.  **Node.js** >= 8.11.3 (LTS)
2.  **NPM** >= 5.6.0

### Steps to run

1.  Clone this repository to your local machine
2.  Using your terminal app of choice, navigate into the repository
3.  `npm i`
4.  `npm start`
