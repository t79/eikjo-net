import json
import boto3
from random import choice

urlDomain = 'https://eikjo.net/'
regionName = 'eu-north-1'
tableName = 'net.eikjo.backgrounds'
tableKey = 'filename'

def lambda_handler(event, context):
    dynamoDBClient = boto3.client('dynamodb',region_name=regionName)

    try:
        tableResponse = dynamoDBClient.scan(TableName=tableName)
        listOfFileNamesEntry = tableResponse['Items']
        
        randomFileName = ''
        if len(listOfFileNamesEntry):
            randomFileNameEntry = choice(listOfFileNamesEntry)
            randomFileName = randomFileNameEntry[tableKey]['S']
            
    except Exception as e:
        raise e
          
    return {
        'statusCode': 301,
        'headers': {    
            'Cache-Control': 'no-cache, max-age=0, must-revalidate'
        },
        'location': urlDomain + randomFileName
    }