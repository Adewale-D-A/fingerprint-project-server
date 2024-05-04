## API SERVICE DOCUMENTATION

> Base Hosted Endpoint: <a href="https://fingerprint-project.azurewebsites.net/" target="_bank">base_url</a>
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

```

#### POST REQUEST: Inform server the verified user

> Endpoint: {{base_url}}`/verify-user`
> Response:

```

{
success: true,
message: `Student name: ${student_name} with Student ID: ${userId} was successfully verified`,
data: {
verified_id: userId,
student_data: student_data,
total_available_ids: 862,
total_registered_ids: 138,
},
}

```

#### GET REQUEST: Check from the server if to delete all registered users

> Endpoint: {{base_url}}`/should_i_delete_all_records`
> Response:

```

{
success: true,
message: `Yes, delete all records from the database`,
data: {
reply: 1, //reply should be between 1 or 0
total_available_ids: 900,
total_registered_ids: 100,
},
}

```

#### POST REQUEST: Inform the server from the hardware that all data have been erased on the hardware

> Endpoint: {{base_url}}`/have_i_deleted_all_records`
> Response:

```

{
success: true,
message: `Hardware replied with 1, all data have been cleared`,
data: {
reply: 1 //1 or 0,
total_available_ids: 1000,
total_registered_ids: 0,
},
}

```


#### POST REQUEST: Delete all verified users history from Database

> Endpoint: {{base_url}}`/delete_all_verified_users_records`
> Response:

```

{
success: true,
message: `Replied with 1, all verified users' history have been cleared`,
data: {
reply: 1 //1 or 0,
total_verified_users: 0,
},
}

```

```

#### POST REQUEST: Set ID to delete

> Endpoint: {{base_url}}`/set-id-to-delete`
> Response:

```

{
        success: true,
        message: `ID to delete has been set to 4`,
        data: {
          reply: 1, //either 1 or 0
          student_data,
          total_available_ids: 88,
          total_registered_ids: 912,
        },
      }

```

#### GET REQUEST: Set ID to delete

> Endpoint: {{base_url}}`/id-to-delete`
> Response:

```

{
      success: true,
      message: `ID to delete is 6`,
      data: {
        reply: 1, //either 1 or 0
        student_data,
        total_available_ids: 88,
        total_registered_ids: 912,
      },
    }

```

#### POST REQUEST: Remove deleted hardware id from server's registered user's database

> Endpoint: {{base_url}}`/remove-id-from-server`
> Response:

```
{
          success: true,
          message: `ID removed from database is 5`,
          data: {
            reply: 1, //either 1 or 0
            student_data,
            total_available_ids: 88,
            total_registered_ids: 912,
          },
        }

```
