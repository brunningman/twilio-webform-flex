# Twilio App

## Goals
### MVP
- Sends messages that an admin can edit via webform
- Manages opt outs (this should be automatic, but will need to write to the database, probably MongoDB or whatever, maybe airtable or smartsheets would work too)
- Receives SMS from a subscriber and routes it to a Flex instance

### Stretch

- Broadcast an sms everytime one of our API competitors goes down
- Posting to slack would be awesome


## Resources
https://www.twilio.com/docs/sms/tutorials/marketing-notifications

https://support.twilio.com/hc/en-us/articles/235288367-Receiving-Two-Way-SMS-and-MMS-Messages-with-Twilio

https://theme.zdassets.com/theme_assets/5194/019301d953d3f937cb5dca35c749673bf5fe2bdd.png

https://www.twilio.com/docs/flex/messaging-orchestration

https://www.twilio.com/docs/studio/tutorials/how-to-post-sms-to-slack

It could be a series of features actually. step one is the first bit, broadcast a message, manage opt outs in a DB automatically

Maybe split into microservices?