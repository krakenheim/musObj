If there is an error occuring with when updating the build on android, this should be added to the app.json file. It could solve the problem

,
    "runtimeVersion": {
      "policy": "appVersion"
    }

Before testing on EXPO go, the runtimeversion should be set to "sdkVersion"


    Eas.json file has been updated to ease the update flow. 
    Hvis is the old code, in case that the build will not finish. Then this should help:

    {
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "channel": "preview"
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      },
      "channel": "preview2"
    },
    "production": {}
  }
  
}