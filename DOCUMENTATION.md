## API SERVICE DOCUMENTATION

> Base Hosted Endpoint: <a href="https://fingerprint-project.azurewebsites.net/" target="_bank">{{https://fingerprint-project.azurewebsites.net/}}</a>
> Base Endpoint Response: `Project server is actively listening`

#### GET REQUEST: Suggest ID for fingerprint registration

> Endpoint: {{base_url}}`/suggested-id`
> Response:

```
{

    "success": true,
    "message": "returning suggested ID in data 67",
    "data": {
        "suggested_id": 67,
        "total_available_ids": 1000,
        "total_registered_ids": 0
    }

}
```

#### POST REQUEST: Fingerprint module inform server of regsitered finger ID

> Endpoint: {{base_url}}`/registered-id`
> Response:

```
{

    "success": true,
    "message": "returning suggested ID in data 67",
    "data": {
        "suggested_id": 67,
        "total_available_ids": 1000,
        "total_registered_ids": 0
    }

}
```

#### GET REQUEST: Fetch all regsitered IDs on the system

> Endpoint: {{base_url}}`/all-registered-ids`
> Response:

```
{

    "success": true,
    "message": "returning all registered IDS in the DB",
    "data": {
        "id_list": [],
        "total_available_ids": 1000,
        "total_registered_ids": 0
    }

}
```
