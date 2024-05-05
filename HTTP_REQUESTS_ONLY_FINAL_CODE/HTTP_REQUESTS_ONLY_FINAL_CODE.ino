
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>


#define CONNECTION_TIMEOUT 10

const char* ssid = "AdewaleMIFI";
const char* password = "oluwadamilare";


//Your Domain name with URL path or IP address with path
String baseUrl = "https://fingerprint-project.azurewebsites.net";
String routeBaseUrl = "/hardware";
String postRegisteredIdApi = baseUrl + routeBaseUrl + "/registered-id"; //inform the server the ID that was registered on fingerprint device
String getSuggestedIdApi = baseUrl + routeBaseUrl + "/suggested-id"; //get server to suggest ID to use in registering a user
String postVerifiedIdApi = baseUrl + routeBaseUrl + "/verify-user"; //inform server on the ID that was just verified
String getDeletePermissionApi = baseUrl + routeBaseUrl + "/should_i_delete_all_records"; //get a response from the server either a 1 or 0 to know if to delete all records
String postRecordDeletionApi = baseUrl + routeBaseUrl + "/have_i_deleted_all_records"; //inform server that records have been clear on the hardware device
String getDeletableIdApi = baseUrl + routeBaseUrl + "/id-to-delete"; //get ID that should be deleted from the server
String postDeletedIdToServerApi = baseUrl + routeBaseUrl + "/remove-id-from-server"; //inform server to remove deleted hardware from server's users database

WiFiClient wifiClient;
HTTPClient httpClient;

String serverResponse; //general string server response
String receivedId; //suggested ID variable
String regId; //registered ID variable
String fingerprintVerifiedId; //verified ID variable
String matricNumber; //retrived verified user's matric number
String systemPurgeReply; //response from server to either purge/delete all stored hardware data or NOT - either a "1" or "0" reply
String systemPurgeStatus; //Once hardware data has been cleared, value is update to carry that state - either a "1" or "0" reply
String serverPurgedStatus; //get server purge/delete status - either a "1" or "0"
String deletableIdResponse; //get id from server that should be deleted
String removeIdFromServer; //removable ID from server

String clearFingerprintData = "0"; //variable to set server data purge response
String deletFingerprintIdData = "0"; //variable to exit while delete loop

int registeredIdPostResponse; //on server registering an ID, return a 1 or 0 if registration is successful

bool wifiConnected = false; //check status of WIFI connection

void setup() {
  Serial.begin(115200);
  delay(1000);
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:
  if (!wifiConnected) {
    connectToWiFi();
  } else {
        Serial.println("\nConnected to WIFI, now getting an ID from server");


//*****************_____________________________*********************____________________*******************
//LOGIC TO PUT IN PLACE TO REGISTER USERS
        // *_________________Get a suggested ID from server for registration______________________*
      //  receivedId = getID();
      //   Serial.println("\nPrinting the ID now");
      //   Serial.println(receivedId);
        // *_________________Get a suggested ID from server______________________*

      //TODO: ADD FINGERPRINT REGISTRATION FUNCTION THAT USES 'receivedId' VARIABLE TO REGISTER A FINGER

        // *_________________Inform server of registered ID______________________*
        // regId = "105";
        // regId = String(105); //convert int to a string
        // registeredIdPostResponse = postRegisteredId(regId); //can either be a 1 or 0
        // Serial.println("\nResponse from ther server states");
        // Serial.println(registeredIdPostResponse);
        // *_________________Inform server of registered ID______________________*

        // Serial.println("\nRegistration is done, wait 5 seconds to register another user");
// delay(5000);

//*****************_____________________________*********************____________________*******************




//*****************_____________________________*********************____________________*******************
// LOGIC TO SEND VERIFIED USER TO SERVER        
        // *_________________Inform server of the verified ID______________________*

        // TODO: ADD FINGERPRINT FUNCTION VERIFICATION

        // fingerprintVerifiedId = "16";
        // matricNumber = postVerifiedId(fingerprintVerifiedId);
        // Serial.println("\nPrinting the verified user's matric number now");
        // Serial.println(matricNumber);

        // Serial.println("\nDone verifying user, wait 5 seconds to verify another user");
        // delay(5000);
        // *_________________Inform server of the verified ID______________________*


//*****************_____________________________*********************____________________*******************




//*****************_____________________________*********************____________________*******************
//LOGIC TO PUT IN PLACE FOR THE DELETE ALL DATA SCREEN
    // while(clearFingerprintData != "1"){
    //     // *_________________Check if to clear all data on system______________________*
    //     systemPurgeReply = getSystemPurgePermission();
    //     Serial.println("\nPrinting the system purge reply now");
    //     Serial.println(systemPurgeReply);
    //    clearFingerprintData = systemPurgeReply;
    //     delay(5000);
    //     // *_________________Check if to clear all data on system______________________*
    // };

    //TODO: ADD FINGERPRINT DATA CLEAR FUNCTION

        // *_________________Hardware system purged, inform server to delete all registered records______________________*
        // systemPurgeStatus = "1"; //system purge status - either "1" or "0"
        // serverPurgedStatus = postSystemPurgeUpdate(systemPurgeStatus);
        // Serial.println("\nPrinting the server purge status now");
        // Serial.println(serverPurgedStatus); //server purge status - either "1" or "0"
        // *_________________Hardware system purged, inform server to delete all registered records______________________*


//*****************_____________________________*********************____________________*******************




//*****************_____________________________*********************____________________*******************
//LOGIC TO DELETE A FINGERPRINT IMAGE FROM HARDWARE AND ALSO ON THE REMOTE DATABASE
    while(deletFingerprintIdData == "0"){
        // *_________________Get deletable Id______________________*
        // deletableIdResponse = getDeletableID();
        // Serial.println("\nPrinting deletable ID now");
        // Serial.println(deletableIdResponse);
        // deletFingerprintIdData = deletableIdResponse;
        // Serial.println("\nWaiting for 5 seconds to before check on the server for updates");
        // delay(5000);
        // *_________________Get deletable Id______________________*
    }

// TODO: ADD FINGERPRINT FUNCTION THAT ACCEPTS AN IMAGE ID i.e. from 'deleteIdResponse' VARIABLE TO INITIATE DELETION

        // *_________________remove Id from server database______________________*
        // removeIdFromServer = "657";
        // matricNumber = postRemoveId(removeIdFromServer);
        // Serial.println("\nPrinting the deleted user's matric number now");
        // Serial.println(matricNumber);
        // deletFingerprintIdData = "0";
        // Serial.println("\nDone deleting user, wait 5 seconds to delete another user");
        // delay(5000);
        // *_________________remove Id from server database______________________*

        delay(3000);
  }

}


//connect to wifi
void connectToWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    return;
  }

    WiFi.mode(WIFI_STA); //Optional
    WiFi.begin(ssid, password);
    Serial.println("\nConnecting...");
    int timeout_counter = 0;

    while(WiFi.status() != WL_CONNECTED){
        Serial.print(".");
        delay(200);
        timeout_counter++;
        if(timeout_counter >= CONNECTION_TIMEOUT*5){ //restart ESP on failure to connect
    Serial.println("\nRestarting microcontroller");
        ESP.restart(); //to wifi which is often a bug that needs a restart to fix
        }
    }

    Serial.println("\nConnected to the WiFi network");
    Serial.print("Local ESP32 IP: ");
    Serial.println(WiFi.localIP());
}


//retrieve suggested ID for registration from the server
String getID() {
  if (!wifiConnected) {
    Serial.println("\nWiFi is not connected. Cannot send HTTP GET request.");
    return "";
  }

  Serial.println("\nSending HTTP GET request...");
  httpClient.begin(getSuggestedIdApi);
  int httpResponseCode = httpClient.GET();

  String idSuggested = "";
  if (httpResponseCode > 0 && httpResponseCode < 400) {
    Serial.print("HTTP GET Response code: ");
    Serial.println(httpResponseCode);
    serverResponse = httpClient.getString();
    Serial.println("\nGET Response:");
    Serial.println(serverResponse);

    JSONVar myObject = JSON.parse(serverResponse);

    if (JSON.typeof(myObject) == "undefined") {
      Serial.println("Parsing response failed!");
      return "";
    }

    JSONVar dataValue = myObject["data"];
    JSONVar suggestedId = dataValue["suggested_id"];
    idSuggested = JSON.stringify(suggestedId);
  } else {
    Serial.print("\nHTTP GET Error code: ");
    Serial.println(httpResponseCode);
  }

  httpClient.end();
  return idSuggested;
}

//inform server of the registered ID
int postRegisteredId(String registerdId) {
  if (!wifiConnected) {
    Serial.println("\nWiFi is not connected. Cannot send HTTP POST request.");
    return 0;
  }

  httpClient.begin(postRegisteredIdApi);
  httpClient.addHeader("Content-Type", "application/json");

  String payload = "{\"userId\":\"" + registerdId + "\"}";
  int httpResponseCode = httpClient.POST(payload);

  if (httpResponseCode > 0 && httpResponseCode < 400) {
    Serial.print("\nHTTP POST Response code: ");
    Serial.println(httpResponseCode);
    serverResponse = httpClient.getString();
    Serial.print("\nHTTP POST Response: ");
    Serial.println(serverResponse);
    return 1;
  } else {
    Serial.print("\nHTTP POST Error code: ");
    Serial.println(httpResponseCode);
    return 0;
  }

  httpClient.end();
}

//inform server of the verified ID and server returns matric number of verified user
String postVerifiedId(String verifiedId) {
  if (!wifiConnected) {
    Serial.println("\nWiFi is not connected. Cannot send HTTP POST request.");
    return "";
  }

  httpClient.begin(postVerifiedIdApi);
  httpClient.addHeader("Content-Type", "application/json");
  String MatNo = "";
  String payload = "{\"userId\":\"" + verifiedId + "\"}";
  int httpResponseCode = httpClient.POST(payload);

  if (httpResponseCode > 0 && httpResponseCode < 400) {
    Serial.print("\nHTTP POST Response code: ");
    Serial.println(httpResponseCode);
    serverResponse = httpClient.getString();
    Serial.print("\nHTTP POST Response: ");
    Serial.println(serverResponse);    
    JSONVar myObject = JSON.parse(serverResponse);

    if (JSON.typeof(myObject) == "undefined") {
      Serial.println("Parsing response failed!");
      return "";
    }

    JSONVar dataValue = myObject["data"];
    JSONVar matricNo = dataValue["student_data"]["matric_no"];
    MatNo = JSON.stringify(matricNo);
    return MatNo;
  } else {
    Serial.print("\nHTTP POST Error code: ");
    Serial.println(httpResponseCode);
    return "";
  }

  httpClient.end();
}

//get permission to delete all stored data on device
String getSystemPurgePermission() {
  if (!wifiConnected) {
    Serial.println("\nWiFi is not connected. Cannot send HTTP POST request.");
    return "0";
  }

  Serial.println("\nGetting delete permission from the server ...");

  httpClient.begin(getDeletePermissionApi);
  httpClient.addHeader("Content-Type", "application/json");

  String purgeReply = "";
  int httpResponseCode = httpClient.GET();

  if (httpResponseCode > 0 && httpResponseCode < 401) {
    Serial.print("\nStatus coDe response is: ");
    Serial.println(httpResponseCode);
    serverResponse = httpClient.getString();
    Serial.print("\nDelete permission response gotten from the server is: ");
    Serial.println(serverResponse);    
    JSONVar myObject = JSON.parse(serverResponse);

    if (JSON.typeof(myObject) == "undefined") {
      Serial.println("Parsing response failed!");
      return "0";
    }

    JSONVar dataValue = myObject["data"];
    JSONVar reply = dataValue["reply"];
    purgeReply = JSON.stringify(reply);
    return purgeReply;
  } else {
    Serial.print("\nHTTP GET Error code for delete permission: ");
    Serial.println(httpResponseCode);
  }

  httpClient.end();
  return purgeReply;
}

//inform server that hardware's registered data has been purged/clear, so server can
//clear its own registered data too
String postSystemPurgeUpdate(String systemResponse) {
  if (!wifiConnected) {
    Serial.println("\nWiFi is not connected. Cannot send HTTP POST request.");
    return "";
  }

  httpClient.begin(postRecordDeletionApi);
  httpClient.addHeader("Content-Type", "application/json");

  String serverReply = "";
  String payload = "{\"reply\":\"" + systemResponse + "\"}";
  int httpResponseCode = httpClient.POST(payload);

  if (httpResponseCode > 0 && httpResponseCode < 401) {
    Serial.print("\nStatus code response is: ");
    Serial.println(httpResponseCode);
    serverResponse = httpClient.getString();
    Serial.print("\nResponse from informing the server is: ");
    Serial.println(serverResponse);
    JSONVar myObject = JSON.parse(serverResponse);

    if (JSON.typeof(myObject) == "undefined") {
      Serial.println("Parsing response failed!");
      return "";
    }

    JSONVar dataValue = myObject["data"];
    JSONVar reply = dataValue["reply"];
    serverReply = JSON.stringify(reply);
  } else {
    Serial.print("\nHTTP POST for Delete Update Error code: ");
    Serial.println(httpResponseCode);
  }

  httpClient.end();
    return serverReply;
}

//retrieve deletable ID from server
String getDeletableID() {
  if (!wifiConnected) {
    Serial.println("\nWiFi is not connected. Cannot send HTTP GET request.");
    return "0";
  }

  Serial.println("\nSending HTTP GET request...");
  httpClient.begin(getDeletableIdApi);
  int httpResponseCode = httpClient.GET();

  String deleteableId = "0";
  if (httpResponseCode > 0 && httpResponseCode < 400) {
    Serial.print("HTTP GET Response code: ");
    Serial.println(httpResponseCode);
    serverResponse = httpClient.getString();
    Serial.println("\nGET Response:");
    Serial.println(serverResponse);

    JSONVar myObject = JSON.parse(serverResponse);

    if (JSON.typeof(myObject) == "undefined") {
      Serial.println("Parsing response failed!");
      return "0";
    }

    JSONVar dataValue = myObject["data"];
    JSONVar receivedId = dataValue["student_data"]["user_id"];
    deleteableId = JSON.stringify(receivedId);
  } else {
    Serial.print("\nHTTP GET Error code: ");
    Serial.println(httpResponseCode);
  }

  httpClient.end();
  return deleteableId;
}

//inform server of the deleted ID
String postRemoveId(String deletableId) {
  if (!wifiConnected) {
    Serial.println("\nWiFi is not connected. Cannot send HTTP POST request.");
    return "";
  }

  httpClient.begin(postDeletedIdToServerApi);
  httpClient.addHeader("Content-Type", "application/json");
  String matNo = "";
  String payload = "{\"userId\":\"" + deletableId + "\"}";
  int httpResponseCode = httpClient.POST(payload);

  if (httpResponseCode > 0 && httpResponseCode < 400) {
    Serial.print("\nHTTP POST Response code: ");
    Serial.println(httpResponseCode);
    serverResponse = httpClient.getString();
    Serial.print("\nHTTP POST Response: ");
    Serial.println(serverResponse);    
    JSONVar myObject = JSON.parse(serverResponse);

    if (JSON.typeof(myObject) == "undefined") {
      Serial.println("Parsing response failed!");
      return "";
    }

    JSONVar dataValue = myObject["data"];
    JSONVar matricNo = dataValue["student_data"]["matric_no"];
    matNo = JSON.stringify(matricNo);
    return matNo;
  } else {
    Serial.print("\nHTTP POST Error code: ");
    Serial.println(httpResponseCode);
    return "";
  }

  httpClient.end();
}