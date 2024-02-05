# CMA Express

The Content Management Node.js API, written in JavaScript with Express.js, facilitates user authentication through email and password login. Upon successful login, users receive a JWT token enabling interaction with the API. This API allows users to create, retrieve, and update books by their respective IDs. Additionally, the API supports the handling of image files. With the help of Multer, it can accept, store, delete, and provide metadata information for uploaded images.

## Development

- Run locally `docker compose --profile development up`

## Production build

- Run locally `docker compose --profile production up`

## Push a image to gitlab registry

- `docker login registry.gitlab.com/hblabs.co --username k3s --password <some_token>`
- `docker buildx bake -f docker-compose.build.yaml --push`

## Apply or delete deployment

Ensure

- The cert-manager helm was installed
- A secret clodflare api token was stored in namespace cert-manager
- `ClusterIssuer` is running
- The namespace hblabsco-cma exists
- A Secret "registry" for the gitlab deloytoken was stored in namespace hblabsco-cma
- mongodb secret for the mongodb dbpassword and dbhost. under `resources/credentials/hblabs.co/cma/mongodb.yaml`
- create the local path `/home/ubuntu/api.hblabs.co/uploads/photos`

Then run

- `kubectl apply -f deployment` for applying certificate and deployment
- `kubectl delete -f deployment` for deleting certificate and deployment
