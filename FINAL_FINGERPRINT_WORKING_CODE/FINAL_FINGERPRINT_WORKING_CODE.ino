#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>
#include <math.h>
#include <EEPROM.h>
#include <SPI.h>
#include <Adafruit_Fingerprint.h>
#include <HardwareSerial.h>
// #include "FINGER.h" //TODO: Uncomment out, was experiencing a library error when not commented out
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
// Define pin constants
#define RXD1 18
#define TXD1 17
// Define pin for the button
#define BUTTON_PIN 8

#define PSU_PIN 9
#define NEOPIXEL_PIN 48
#define NUMPIXELS 1
#define BRIGHTNESS 50

unsigned int id;
//unsigned int id_verified  = finger.fingerID;



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

// Define fingerprint sensor and display objects
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&Serial1);
Adafruit_NeoPixel pixels(NUMPIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);
U8G2_ST7920_128X64_F_SW_SPI u8g2(U8G2_R0, /* clock=*/5, /* data=*/6, /* CS=*/4, /* reset=*/16);

// Define variables for tracking button state and page selection
volatile bool isButtonPressed = false;
volatile unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 500;  // milliseconds
int currentPage = 0;

void setup() {
  // Initialize serial communication
  Serial.begin(57600);
  Serial1.begin(115200, SERIAL_8N1, RXD1, TXD1);

  // Initialize peripherals
  pixels.begin();
  pixels.setBrightness(BRIGHTNESS);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(PSU_PIN, OUTPUT);
  digitalWrite(PSU_PIN, LOW);

  // Attach buttonInterrupt() function to the interrupt vector for the button pin
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), buttonInterrupt, CHANGE);


  // Initialize display
  u8g2.begin();
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_helvB08_tf);
  u8g2.setCursor(0, 9);
  u8g2.print("341 COMMUNICATIONS");
  u8g2.setCursor(25, 25);
  u8g2.print("GROUP, ILORIN");
  u8g2.setCursor(10, 40);
  u8g2.print("NIGERIAN AIR FORCE");
  u8g2.sendBuffer();

  // Initialize fingerprint sensor
  finger.begin(57600);
  if (!finger.verifyPassword()) {
    Serial.println("Did not find fingerprint sensor :(");
    while (true) { delay(1); }
  }
  finger.getParameters();
  finger.getTemplateCount();

  // Connect to Wi-Fi
  connectToWiFi();
}

void loop() {
  digitalWrite(PSU_PIN, LOW);
  unsigned long currentMillis = millis();
  if (currentMillis - lastDebounceTime > debounceDelay) {
    if (isButtonPressed) {
      handleButtonPress();
      isButtonPressed = false;
    }
  }

  // Perform tasks based on the current page
  switch (currentPage) {
    case 0:
      displayAttendancePage();
      break;
    case 1:
      displayEnrollmentPage();
      break;
    case 2:
      displayDeletingUserID();
      break;
    case 3:
      displayDeletePage();
      break;
    case 4:
      displayDeviceInfoPage();
      break;
    default:
      break;
  }

  // Other non-blocking tasks can be performed here
}

// Function to handle button press interrupt
void buttonInterrupt() {
  // Read the state of the button
  int buttonState = digitalRead(BUTTON_PIN);

  // Check if the button state has changed
  if (buttonState == LOW) {
    // Record the time when the button was pressed
    lastDebounceTime = millis();
    isButtonPressed = true;
  }
}


// Function to handle button press
void handleButtonPress() {
  currentPage = (currentPage + 1) % 5;
}


// Function to connect to Wi-Fi
void connectToWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
  Serial.println("Connected to Wi-Fi.");
    return;
  }

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to Wi-Fi...");
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startTime > 10000) {
      Serial.println("Failed to connect to Wi-Fi. Restarting...");
      ESP.restart();
    }
    delay(500);
  }
  Serial.println("Connected to Wi-Fi.");
}


/////////////////////////////////////////////
// DELETING USER ID PRE FUNCTION //
unsigned int readnumber(void) {
  unsigned int num = 0;
  num = Serial.parseInt();
  return num;
}
///////////////////////////////////////////

// Function to display attendance marking page
void displayAttendancePage() {
  // Your implementation for displaying the attendance page
  u8g2.clearBuffer();
  u8g2.setFontMode(1);  /* activate transparent font mode */
  u8g2.setDrawColor(1); /* color 1 for the box */
  u8g2.drawBox(0, 0, 128, 8);
  u8g2.setDrawColor(2);
  u8g2.setFont(u8g2_font_courR08_tf);
  u8g2.setFontDirection(0);
  u8g2.setCursor(10, 7);
  u8g2.print("ATTENDANCE MARKING");
  //u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.setCursor(93, 62);
  u8g2.print("ID:");
  u8g2.setCursor(110, 62);
  u8g2.print(finger.fingerID);

  u8g2.drawXBMP(93, 9, u8g2_FinPr_scan_width, u8g2_FinPr_scan_height, u8g2_FinPr_scan_bits);
  u8g2.sendBuffer();

  for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...
    pixels.setPixelColor(i, pixels.Color(255, 200, 0));
    pixels.show();  // Send the updated pixel colors to the hardware.
    //delay(500);
  }
  
  uint8_t p = finger.getImage();

  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
  }

  if (p == FINGERPRINT_OK) {
    p = finger.image2Tz();

    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Image converted");
        break;
      case FINGERPRINT_IMAGEMESS:
        Serial.println("Image too messy");
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Communication error");
        break;
      case FINGERPRINT_FEATUREFAIL:
      case FINGERPRINT_INVALIDIMAGE:
        Serial.println("Could not find fingerprint features");
        break;
      default:
        Serial.println("Unknown error");
        break;
    }

    if (p == FINGERPRINT_OK) {
      p = finger.fingerSearch();

      if (p == FINGERPRINT_OK) {
        Serial.println("Found a print match!");
        Serial.print("Found ID #");
        Serial.print(finger.fingerID); //ID Value
        Serial.print(" with confidence of ");
        Serial.println(finger.confidence);

        //*****************_____________________________*********************____________________*******************
        // LOGIC TO SEND VERIFIED USER TO SERVER        
        // *_________________Inform server of the verified ID______________________*

        fingerprintVerifiedId = String(finger.fingerID);
        matricNumber = postVerifiedId(fingerprintVerifiedId);
        Serial.println("\nPrinting the verified user's matric number now");
        Serial.println(matricNumber);

        Serial.println("\nDone verifying user, wait 5 seconds to verify another user");
        delay(5000);

        // *_________________Inform server of the verified ID______________________*

        //*****************_____________________________*********************____________________*******************
      } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
        Serial.println("Communication error");
      } else if (p == FINGERPRINT_NOTFOUND) {
        u8g2.clearBuffer();
        u8g2.setFont(u8g2_font_5x7_tf);
        u8g2.setCursor(3, 62);
        u8g2.print("Did not find a match");
        u8g2.sendBuffer();
        id = 0;
        delay(5000);
        Serial.println("Did not find a match");
      } else {
        Serial.println("Unknown error");
      }
    }
  }
}

// Function to display enrollment page
void displayEnrollmentPage() {
  // Your implementation for displaying the enrollment page
  u8g2.clearBuffer();
  u8g2.setFontMode(1);  /* activate transparent font mode */
  u8g2.setDrawColor(1); /* color 1 for the box */
  u8g2.drawBox(0, 0, 128, 8);
  u8g2.setDrawColor(2);
  u8g2.setFont(u8g2_font_courR08_tf);
  u8g2.setFontDirection(0);
  u8g2.setCursor(0, 7);
  u8g2.print("ENROLLMENT REGISTRATION");
  u8g2.setCursor(27, 30);
  u8g2.print("ID: ");
  u8g2.print(id);

  u8g2.sendBuffer();

  for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...
    pixels.setPixelColor(i, pixels.Color(0, 255, 0));

    pixels.show();
  }
  Serial.println("Ready to enroll a fingerprint!");
  Serial.println("Please type in the ID # (from 1 to 127) you want to save this finger as...");
  
  
  //*****************_____________________________*********************____________________*******************
  //LOGIC TO PUT IN PLACE TO REGISTER USERS
      // *_________________Get a suggested ID from server for registration______________________*
       receivedId = getID();
        Serial.println("\nPrinting the ID now");
        Serial.println(receivedId);
      // *_________________Get a suggested ID from server______________________*

  id = receivedId.toInt(); //readnumber();
  if (id == 0) {
    return;
  }
  Serial.print("Enrolling ID #");
  Serial.println(id);

  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #");
  Serial.println(id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Image taken");
        break;
      case FINGERPRINT_NOFINGER:
        Serial.print(".");
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Communication error");
        break;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Imaging error");
        break;
      default:
        Serial.println("Unknown error");
        break;
    }
  }

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
    case FINGERPRINT_PACKETRECIEVEERR:
    case FINGERPRINT_FEATUREFAIL:
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return;
    default:
      Serial.println("Unknown error");
      return;
  }

  Serial.println("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }

  Serial.print("ID ");
  Serial.println(id);
  p = -1;
  Serial.println("Place same finger again");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Image taken");
        break;
      case FINGERPRINT_NOFINGER:
        Serial.print(".");
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Communication error");
        break;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Imaging error");
        break;
      default:
        Serial.println("Unknown error");
        break;
    }
  }

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
    case FINGERPRINT_PACKETRECIEVEERR:
    case FINGERPRINT_FEATUREFAIL:
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return;
    default:
      Serial.println("Unknown error");
      return;
  }

  Serial.print("Creating model for #");
  Serial.println(id);
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    return;
  } else {
    Serial.println("Unknown error");
    return;
  }

  Serial.print("ID ");
  Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");

        // *_________________Inform server of registered ID______________________*
          // regId = "105";
        regId = String(id); //convert int to a string
        registeredIdPostResponse = postRegisteredId(regId); //can either be a 1 or 0
        Serial.println(registeredIdPostResponse);
        Serial.println("\nRegistration is done, wait 5 seconds to register another user");
        delay(5000);
        // *_________________Inform server of registered ID______________________*

  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return;
  } else {
    Serial.println("Unknown error");
    return;
  }

  //delay(500); // Add a delay to avoid continuous enrollment attempts
}



// Function to display delete page
void displayDeletingUserID() {
  u8g2.clearBuffer();
  u8g2.setFontMode(1);  /* activate transparent font mode */
  u8g2.setDrawColor(1); /* color 1 for the box */
  u8g2.drawBox(0, 0, 128, 8);
  u8g2.setDrawColor(2);
  u8g2.setFont(u8g2_font_courR08_tf);
  u8g2.setFontDirection(0);
  u8g2.setCursor(20, 7);
  u8g2.print("DELETE USER ID");

    while(deletFingerprintIdData == "0"){
        // *_________________Get deletable Id______________________*
        deletableIdResponse = getDeletableID();
        deletFingerprintIdData = deletableIdResponse;
        Serial.println("\nWaiting for 5 seconds to before checking the server for updates");
        delay(5000);
        // *_________________Get deletable Id______________________*
    }

  id = deletFingerprintIdData.toInt() //readnumber();
  Serial.print("Deleting ID #");
  Serial.println(id);
  u8g2.setCursor(2, 40);
  u8g2.print("USER ID:");
  u8g2.print(id);
  u8g2.print("IS DELETED");
  deleteFingerprint(id);

          // *_________________remove Id from server database______________________*
        removeIdFromServer = String(id);
        matricNumber = postRemoveId(removeIdFromServer);
        Serial.println("\nPrinting the deleted user's matric number now");
        Serial.println(matricNumber);
        deletFingerprintIdData = "0";
        Serial.println("\nDone deleting user, wait 5 seconds to delete another user");
        delay(5000);
        // *_________________remove Id from server database______________________*

  u8g2.sendBuffer();
  for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...

    pixels.setPixelColor(i, pixels.Color(0, 0, 255));

    pixels.show();
  }
}



// Function to display delete page
void displayDeletePage() {
  // Your implementation for displaying the delete page
  u8g2.clearBuffer();
  u8g2.setFontMode(1);  /* activate transparent font mode */
  u8g2.setDrawColor(1); /* color 1 for the box */
  u8g2.drawBox(0, 0, 128, 8);
  u8g2.setDrawColor(2);
  u8g2.setFont(u8g2_font_courR08_tf);
  u8g2.setFontDirection(0);
  u8g2.setCursor(11, 7);
  u8g2.print("DELETE ALL USER ID");

  u8g2.setFont(u8g2_font_4x6_tf);
  u8g2.setCursor(1, 15);
  u8g2.print("NOTE All ");
  u8g2.print(finger.templateCount);
  u8g2.print(" saved Finger Print");
  u8g2.setCursor(1, 22);
  u8g2.print("ID Will Be Permanently Erased");
  u8g2.setCursor(1, 29);
  u8g2.print("And Cannot Be Retrieved Again");

  u8g2.setFont(u8g2_font_courR08_tf);
  u8g2.setCursor(10, 38);
  u8g2.print("TAKE NOTE OF YOUR");
  u8g2.setCursor(40, 46);
  u8g2.print("ACTION");

  u8g2.setFont(u8g2_font_courR08_tf);
  u8g2.setCursor(2, 56);
  u8g2.print(finger.templateCount);
  u8g2.print("ID Will Be Deleted");
  u8g2.sendBuffer();


    while(clearFingerprintData != "1"){
        // *_________________Check if to clear all data on system______________________*
        systemPurgeReply = getSystemPurgePermission();
        Serial.println("\nPrinting the system purge reply now");
        Serial.println(systemPurgeReply);
       clearFingerprintData = systemPurgeReply;
        // *_________________Check if to clear all data on system______________________*
        delay(5000);
    };

  // if (Serial.available() && (Serial.read() == 'Y')) {
    finger.emptyDatabase();
    u8g2.clearBuffer();
    u8g2.setCursor(20, 8);
    u8g2.print(finger.templateCount);
    u8g2.print(" ID IS Deleted");

    
        // *_________________Hardware system purged, inform server to delete all registered records______________________*
        systemPurgeStatus = "1"; //system purge status - either "1" or "0"
        serverPurgedStatus = postSystemPurgeUpdate(systemPurgeStatus);
        Serial.println("\nPrinting the server purge status now");
        Serial.println(serverPurgedStatus); //server purge status - either "1" or "0"
        // *_________________Hardware system purged, inform server to delete all registered records______________________*



    u8g2.drawXBMP(39, 9, u8g2_Delete_width, u8g2_Delete_height, u8g2_Delete_bits);
    u8g2.sendBuffer();
    delay(5000);
  // }

  // delay(5500);
  for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...

    pixels.setPixelColor(i, pixels.Color(0, 255, 255));

    pixels.show();
  }
}

// Function to display device information page
void displayDeviceInfoPage() {
  // Your implementation for displaying the device information page

  u8g2.clearBuffer();
  u8g2.setFontMode(1);  /* activate transparent font mode */
  u8g2.setDrawColor(1); /* color 1 for the box */
  u8g2.drawBox(0, 0, 128, 8);
  u8g2.setDrawColor(2);
  u8g2.setFont(u8g2_font_courR08_tf);
  u8g2.setFontDirection(0);

  u8g2.setCursor(10, 7);
  u8g2.print("DEVICE INFORMATION");

  finger.getParameters();

  u8g2.setFont(u8g2_font_4x6_tf);
  u8g2.setCursor(1, 16);
  u8g2.print("MCU:ESP32S3");
  u8g2.setCursor(64, 16);
  u8g2.print("SENSOR TYPE:R307");

  u8g2.setCursor(1, 24);
  u8g2.print("Sys ID:0x");
  u8g2.print(finger.system_id, HEX);
  u8g2.setCursor(64, 24);
  u8g2.print("SENSOR CAP:");
  u8g2.print(finger.capacity);

  u8g2.setCursor(1, 31);
  u8g2.print("Status:0x");
  u8g2.print(finger.status_reg, HEX);
  u8g2.setCursor(64, 31);
  u8g2.print("Security level:");
  u8g2.print(finger.security_level);

  u8g2.setCursor(1, 38);
  u8g2.print("Packet len:");
  u8g2.print(finger.packet_len);
  u8g2.setCursor(64, 38);
  u8g2.print("Baud rate:");
  u8g2.print(finger.baud_rate);

  u8g2.setCursor(20, 45);
  u8g2.print("Device Address:");
  u8g2.print(finger.device_addr, HEX);

  finger.getTemplateCount();

  if (finger.templateCount == 0) {
    u8g2.setFont(u8g2_font_courR08_tf);
    u8g2.setCursor(4, 55);
    u8g2.print("NO REGISTERED FINGER ID");
  } else {
    int id_left = finger.capacity - finger.templateCount;
    u8g2.setFont(u8g2_font_courR08_tf);
    u8g2.setCursor(20, 54);
    u8g2.print("REG FINGER ID:");
    u8g2.print(finger.templateCount);

    u8g2.setCursor(35, 63);
    u8g2.print("ID LEFT:");
    u8g2.print(id_left);
  }

  u8g2.sendBuffer();

  for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...

    pixels.setPixelColor(i, pixels.Color(255, 0, 255));

    pixels.show();
  }
}

//////////////////////////////////////////////////////////
//DELECTING USER ID POST FUNCTION//
unsigned int deleteFingerprint(unsigned int id) {
  unsigned int p = -1;
  p = finger.deleteModel(id);
  return p;
}



// ***********************--------------------------******************************--------------------------
//HTTP REQUEST FUNCTIONS


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
    JSONVar receivedIdResponse = dataValue["student_data"]["user_id"];
    deleteableId = JSON.stringify(receivedIdResponse);
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



// ***********************--------------------------******************************--------------------------
//HTTP REQUEST FUNCTIONS