# Adobe Campaign Standard API Playground
  Try this simple app to locally run and talk to your Adobe Campaign Standard (ACS) instance!

1. [Setup](#Setup)
1. [Run It!](#Run)

## <a name="Setup">Setup</a>

To set up the playground:

1. Create a Campaign integration on the [Adobe I/O Console](https://console.adobe.io/integrations). Follow the [Campaign configuration instructions](https://docs.campaign.adobe.com/doc/standard/en/api/ACS_API.html#adobeio-configuration). Once created, the details appear similar to those shown below:
  
  ![screenshot 2017-10-12 16 03 49](https://user-images.githubusercontent.com/7494850/31523228-1d64a7b8-af67-11e7-9c0d-b5fa6e228b6a.png)
  
1. Obtain and record your private key.
1. Clone the repository and update your ```/cert/secret.key``` file with the value from your integration on the Adobe I/O Console.

## <a name="Run">Run It!</a>

 To run the app, execute the following commands:
  
  ```sh
  $ npm install
  $ npm start
  ```
Browse to https://localhost:3000 and follow the shown instruction. Paste your credentials (which can be found in your I/O integration), and you are ready to start!

 ![screenshot 2017-10-12 16 02 29](https://user-images.githubusercontent.com/7494850/31523179-d91b0836-af66-11e7-93a9-0a67da85e9d9.png)

# Author
- Sarah Xu [@sarahxxu](https://github.com/sarahxxu).

# License
[MIT](LICENSE)
