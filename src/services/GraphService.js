var graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: done => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api("/me").get();
  return user;
}

export async function getEvents(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const events = await client
    .api("/me/events")
    .select("subject,organizer,start,end")
    .orderby("createdDateTime DESC")
    .get();

  return events;
}

export async function getMails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const mails = await client
    .api("/me/messages")
    .select("id,subject,receivedDateTime,sender,from,toRecipients,bodyPreview")
    .filter("receivedDateTime ge 1900-01-01T00:00:00Z and importance eq 'high'")
    .orderby("receivedDateTime DESC")
    .get();

  return mails;
}
