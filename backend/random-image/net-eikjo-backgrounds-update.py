import boto3

regionName = 'eu-north-1'
tableName = 'net.eikjo.backgrounds'
tableKey = 'filename'

def lambda_handler(event, context):
    
    dynamoDBClient = boto3.client('dynamodb', region_name=regionName)
    
    record = event['Records'][0]
    action = record['eventName']
    
    try:
        
        if 'Created' in action:
            dynamoDBClient.put_item(TableName=tableName,
                Item={tableKey: {'S': record['s3']['object']['key'] }})
                
        if 'Removed' in action:
            dynamoDBClient.delete_item(TableName=tableName, 
                Key={tableKey: {'S': record['s3']['object']['key'] }})
        
    except Exception as e:
        raise e