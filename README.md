## Requirement

```shell
node v16.14.2
mysql v8.0.29
```

## Installation

1. Install dependencies
```shell
npm install
```

3. Create database (e.g. zsn)
```shell
create database zsn
```
4. Set MYSQL configuration at /config/Env.json
5. Run schema.sql file to generate database schema
6. Run the application (by default it will run at port 5050)
```shell
npm run start
```

## API Docs
### Register Survivor
```shell
POST /survivor/register
content-type: "application/json"
request:
{
    "name": "Joe",
    "age": "20",
    "gender": "MALE",
    "waterTotal": 10,
    "foodTotal": 20,
    "medicationTotal": 10,
    "ammunitionTotal": 2
}
response:
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Joe",
        "age": "20",
        "gender": "MALE",
        "waterTotal": 10,
        "foodTotal": 20,
        "medicationTotal": 10,
        "ammunitionTotal": 2
    }
}
```

### Update Survival Location
```shell
PATCH /survivor/:survivorId/update-location
params: survivorId
content-type: "application/json"
request:
{
    "latitude": "-21992.39723",
    "longitude": "882982.2313"
}
response:
{
    "status": "success",
    "data": "Location updated"
}
```

### Report Contamination Survivor

Field      | Description
-------------- | -----------
fromSurvivorId  | survivor id as who's reporting
toSurvivorId | survivor id as who's contaminated

```shell
POST /contamination/report-survivor
content-type: "application/json"
request:
{
    "fromSurvivorId": 1,
    "toSurvivorId": 2
}
response:
{
    "status": "success",
    "data": "success"
}
error:
{
    "status": "error",
    "message": "You already reported this survivor"
}
```

### Trade

Field      | Description
-------------- | -----------
buyerSurvivorId  | survivor id as a buyer
sellerSurvivorId | survivor id as a seller

```shell
POST /trade
content-type: "application/json"
request:
{
    "buyerSurvivorId": 1,
    "sellerSurvivorId": 2,

    "waterTotalBuyer": "0",
    "foodTotalBuyer": "0",
    "medicationTotalBuyer": "0",
    "ammunitionTotalBuyer": "6",
    
    "waterTotalSeller": "1",
    "foodTotalSeller": "0",
    "medicationTotalSeller": "1",
    "ammunitionTotalSeller": "0"
}
response:
{
    "status": "success",
    "data": "Trade success"
}
error:
{
    "status": "error",
    "message": "Trade failed. Item points not satisfied"
}
```


### Report Survivor Percentage

```shell
GET /report/survivor-percentage
content-type: "application/json"
response:
{
    "status": "success",
    "data": {
        "infectedSurvivorPercentage": "0.00",
        "notInfectedSurvivorPercentage": "100.00"
    }
}
```

### Report Average Amount Item

```shell
GET /report/average-amount-item
content-type: "application/json"
response:
{
    "status": "success",
    "data": {
        "waterAverage": "10.0000",
        "foodAverage": "20.0000",
        "medicationAverage": "10.0000",
        "ammunitionAverage": "2.0000"
    }
}
```


### Report Point Lost

```shell
GET /report/point-lost
content-type: "application/json"
response:
{
    "status": "success",
    "data": 27
}
```