import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
} from "react-native";
import Constants from "expo-constants";
import { Camera, CameraType } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";

const TensorCamera = cameraWithTensors(Camera);

const initialiseTensorflow = async () => {
  await tf.ready();
  tf.getBackend();
};

const textureDims =
  Platform.OS === "ios"
    ? {
        height: 1920,
        width: 1080,
      }
    : {
        height: 1200,
        width: 1600,
      };

let frame = 0;
const computeRecognitionEveryNFrames = 60;

export default function ObjScreen() {
        const [hasPermission, setHasPermission] = useState<null | boolean>(
          null
        );
        const [detections, setDetections] = useState<string[]>([]);
        const [net, setNet] = useState<mobilenet.MobileNet>();
        const [modalVisible, setModalVisible] = useState(false);

        const DATA = {
          "sweet potato": {
            image: require("../../assets/images/hjelm.jpg"),
            title: "Hjelm fra 2. verdenskrig",
            text: "Denne hjem er fra en falden soldat, som oprindeligt boede i Skanderborg. Under 2. verdenskrig blev soldaten sendt til vestfronten...",
          },
          "paper towel": {
            image: require("../../assets/images/pilespids.jpg"),
            title: "Pilespids fra stenalderen",
            text: "Denne pilespids er fundet ved Rinkloster, og er brugt som pilespids til at nedlægge vildsvin",
          },
          "pool table": {
            image: require("../../assets/images/perler.jpg"),
            title: "Perler",
            text: "Perlerne er blevet brugt til særlige begivenheder.",
          },
          "piggy bank": {
            image: require("../../assets/images/perler.jpg"),
            title: "Perler",
            text: "Perlerne er blevet brugt til særlige begivenheder.",
          },
          "billiard table": {
            image: require("../../assets/images/perler.jpg"),
            title: "Perler",
            text: "Perlerne er blevet brugt til særlige begivenheder.",
          },
        };

      const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
        const loop = async () => {
          if (net) {
            if (frame % computeRecognitionEveryNFrames === 0) {
              const nextImageTensor = images.next().value;
              if (nextImageTensor) {
                const objects = await net.classify(nextImageTensor);
                if (objects && objects.length > 0) {
                  setDetections(objects.map((object) => object.className));
                }
                tf.dispose([nextImageTensor]);
              }
            }
            frame += 1;
            frame = frame % computeRecognitionEveryNFrames;
          }

          requestAnimationFrame(loop);
        };
        loop();
      };

      useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
          await initialiseTensorflow();
          setNet(await mobilenet.load({ version: 1, alpha: 0.25 }));
        })();
      }, []);

      if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }
      if (!net) {
        return <Text style={styles.loading}>Loading Data</Text>;
      }

  return (
    <View style={styles.container}>
      <TensorCamera
        useCustomShadersToResize={false} // Maybe causing error. If so,  set true.
        style={styles.camera}
        onReady={handleCameraStream}
        type={CameraType.back} //Camera.Constants.Type.back causing error in TS. Changed to CameraType Dependency
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        autorender={true}
      />
      {/* <View style={styles.text}>
        {detections.map((detection, index) => (
          <Text key={index}>{detection}</Text>
        ))}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
  },
  camera: {
    flex: 10,
    width: "100%",
  },
  loading: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});

