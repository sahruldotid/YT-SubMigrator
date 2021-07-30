# YT-SubMigrator
> Migrating your youtube subscription to another account.

Built with ExpressJS. The main function is simple, its download subscription data on your youtube account as json. And then upload those json on another account. Unfortunately, google has some restriction of using free API. There are limit request per day (quota), so if you need to add more quota, you need contact google.

![Migrator](https://user-images.githubusercontent.com/11147011/127598019-f2b0063c-e250-428f-8db2-75912dcef010.png)

### Requirement
* bower
* npm
* oauth keys (rename it into oauth2.keys.json and copy to this tool home dir)

### How to install
* git clone https://github.com/sahruldotid/YT-SubMigrator.git
* cd YT-SubMigrator
* npm i
* npm start
