import json
import botocore
import boto3
import re

regex = '^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'

def lambda_handler(event, context):

    name = event['name']
    email = event['email']
    message = event['message']
    
    if (name == "" and email == "" and message == ""):
        responce = {
            'statusCode': 400,
            'body': 'The server has stopped your message. All field was empty, so no point in sending it.'
        }
        raise Exception(json.dumps(responce))
    
    if (name == ""):
        name = "Anonymous"
    
    validEmail = False
    replay = f"{name} <no-replay@eikjo.net>"
    if (re.search(regex, email)):
        replay = f'{name} <{email}>'
        validEmail = True
        
    
    sesClient = boto3.client('ses')
    
    try:
        responce = sesClient.send_email(
                Source = 'The Eikjo.net webpage <contact-and-feedback@eikjo.net>',
                Destination = {
                    'ToAddresses' : [
                            'Eikjo.net author <author@eikjo.net>'
                        ]
                },
                Message = {
                    'Subject' : {
                        'Charset' : 'UTF-8',
                        'Data' : 'Message from ' + name
                    },
                    'Body' : {
                        'Text' : {
                            'Charset' : 'UTF-8',
                            'Data' : message
                        }
                    }
                },
                ReplyToAddresses = [
                        replay
                ]
            )
    
    except botocore.exceptions.ClientError as error:
        print(error)
        responce = {
            'statusCode': 500,
            'body': "I got a failure response from the email service that transfers the message. It was not possible to send it."
        }
        raise Exception(json.dumps(responce))
        
    if (validEmail):
        return {
            'statusCode': 200,
            'body': "Your message has been sent to me by email."
        }
    
    return {
        'statusCode': 200,
        'body': "Your message has been sent to me by email, but with no valid replay address."
    }

#
# Setting up the api-gateway
# https://dikshit18.medium.com/mapping-api-gateway-with-lambda-output-e8ea9e435bbf    