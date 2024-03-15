# EgloEmail

Email server for Eglo

# Installation

> Build from source
> You can compile this from source using Node.js the same way you would any Node.js project,
> just make sure to create a .env file and fill it in with the correct data, using the example.env file.

> Docker
> Run this using the Dockerfile, and make sure to add the enviroment variables specified in the example.env

# Hosting

All of the sensitive routes are secured with their own keys as specified in the example.env and set in the .env,
how to use these routes is shown below.

# Connecting
This server runs at port 3000 locally


GET EMAILS
`http://your-server:3000/api/email-api/get?auth=YOUR_GET_AUTH_TOKEN_HERE`

>JSON:

```
{
    email: "EMAIL OF USER YOU WANT TO GET RECEIVED EMAILS FROM"
}
```


SEND EMAIL
`http://your-server:3000/api/email-api/send?auth=YOUR_SEND_AUTH_TOKEN_HERE`

>JSON:

```
{
    to: "EMAIL OF OTHER PERSON",
    from: "YOUR EMAIL WITH DOMAIN SETUP IN Resend.com",
    subject: "SUBJECT OF EMAIL",
    html: "HTML CONTENT OF EMAIL TO SEND"
}
```



RECEIVE EMAIL
`http://your-server:3000/api/email-api/receive?auth=YOUR_RECEIVE_AUTH_TOKEN_HERE`

>CONTENT:

```
RAW EMAIL FROM CLOUDFLARE WORKER (NOT A ROUTE FOR PEOPLE)
```



SENT EMAILS
`http://your-server:3000/api/email-api/sent?auth=YOUR_SENT_AUTH_TOKEN_HERE`

>JSON:

```
{
    email: "EMAIL OF USER THAT RECEIVED EMAIL"
}
```

# Setup with Cloudflare Email Worker
Paste this code into the Cloudflare Worker, make sure to change the URL below to match your server


```
async function streamToString(stream) {
  const reader = stream.getReader();
  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += new TextDecoder().decode(value);
  }
  return result;
}

export default {
  async email(event, env, ctx) {
    const rawEmail = await streamToString(event.raw);

      await fetch("https://your-email-server.com/api/email-api/receive?auth=your-auth-token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({raw_email: rawEmail}),
    })
  },

  
  async fetch(request) {
    const data = {
      status: "awake",
    };
  
    return Response.json(data);
  },
};

```

It is recommended to set this Cloudflare Worker as a "Catch All" so that all emails go to this worker to be sent to the server.

# Resend.com
Make sure that Resend.com is setup properly with your domain and that the API token is correct.

# ENV
```
MONGODB_URL = "YOUR MONGODB URL"

GET_AUTH = "RANDOM STRING"
SEND_AUTH = "RANDOM STRING"
RECEIVE_AUTH = "RANDOM STRING"
SENT_AUTH = "RANDOM STRING"

RESEND_TOKEN = "YOUR RESEND TOKEN"
```

# Disclaimer
This is not designed to be secure or fast, but it works, at least locally (lol)
