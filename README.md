# CMA Express

## Development

- Run locally `docker compose --profile development up`

## Production build

- Run locally `docker compose --profile production up`

## Push a image to gitlab registry

- `docker login registry.gitlab.com/hblabs.co --username k3s --password <some_token>`
- `docker buildx bake -f docker-compose.build.yaml --push`

## Apply or delete deployment

- create the secret for the mongodb dbpassword and dbhost. See Basic Resources
- create the certificate for api.hblabs.co `kubectl apply -f deployment/certificate.yaml`
- `kubectl apply -f deployment/deployment.yaml`
- `kubectl delete -f deployment/deployment.yaml`
