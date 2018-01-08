# Adobe Campaign Standard API Playground
  Try this simple app to locally run and talk to your Adobe Campaign Standard (ACS) instance!

1. [Setup](#Set Up the Playground)
1. [Run](#Run It!)

## <a name="Setup">Setup</a>

To set up the playground:

1. Create A Campaign Integration on Adobe I/O

Create a Follow [this documentation](https://docs.campaign.adobe.com/doc/standard/en/api/ACS_API.html#adobeio-configuration) to create a Campaign Integration on [Adobe I/O Console](https://console.adobe.io/integrations). Once your integration has been created (it should look something like this picture below) and you have your private key in hand. You are ready to play with the website!
  
  ![screenshot 2017-10-12 16 03 49](https://user-images.githubusercontent.com/7494850/31523228-1d64a7b8-af67-11e7-9c0d-b5fa6e228b6a.png)
  
1. Clone repo and update /cert/secret.key file
  When you are creating your integration on I/O, you should have created a secret.key file for your secret key. Now, copy paste that value into the /cert/secret.key file.

## <a name="Run">Run It!</a>

  After you've updated your secret.key file, you are all set to run it!
  ```sh
  $ npm install
  $ npm start
  ```
  Now if you go to https://localhost:3000, you should be able to see this view. Follow the instruction, paste in your credentials (which can be found in your I/O integration), and you are ready to start!

 ![screenshot 2017-10-12 16 02 29](https://user-images.githubusercontent.com/7494850/31523179-d91b0836-af66-11e7-93a9-0a67da85e9d9.png)

# Author
- Sarah Xu [@sarahxxu](https://github.com/sarahxxu).

# Lincense
[MIT](LICENSE)
