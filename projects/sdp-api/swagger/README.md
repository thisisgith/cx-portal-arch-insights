# Generate models, services, and modules for APIs

# Set into the API directory

cd to the sdp-api directory

# Copy swagger file into the project
Manually copy the swagger yaml file to the ./swagger directory

# Create a config spec
In the ./swagger/ng-gen directory, manually create a configuration json file corresponding to the swagger yaml or json file. Typically, start by coping one of existing ones. This is the config spec used by ng-swagger-gen.

# Generate Angular 6 code
Use the ng-swagger-gen command to generate code.

ng-swagger-gen --config ./swagger/ng-gen/RacetrackInfo.json

Manually update public-api.ts to export the models, services, and module.
