import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  Alert,
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

/* Sets how often it detects items */
const computeRecognitionEveryNFrames = 200;

export default function ObjScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [looking, setLooking] = useState(true);
  const [detections, setDetections] = useState<string[]>([]);
  const [net, setNet] = useState<mobilenet.MobileNet>();
  const [activeModal, setActiveModal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const DATA = {
    "remote control, remote": {
      image: require("../../assets/images/hjelm.jpg"),
      title: "Hjelm fra 2. verdenskrig",
      text: "Denne hjem er fra en falden soldat, som oprindeligt boede i Skanderborg. Under 2. verdenskrig blev soldaten sendt til vestfronten...",
    },
    "computer keyboard, keypad": {
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

  const { title, text, image } = DATA[activeModal] || {};

  const closeModal = () => {
    setModalVisible(false);
    setActiveModal(null);
  };

  const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
    if (looking === true) {
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
    } else {
      return console.log("waiting");
    }
  };

  /*  const handleDetections = (detection) => {
    return detection.map((detection) => {
      const data = DATA[detection];
      if (data) {
        return data;
      }
      return null;
    });
  }; */

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      await initialiseTensorflow();
      setNet(await mobilenet.load({ version: 1, alpha: 0.25 }));
    })();
  }, []);

  /* console.log(detections[1]); */

  useEffect(() => {
    const item = detections[1];
    console.log(item);

    /* console.log("i run") */
    if (
      item === "remote control, remote" ||
      "computer keyboard, keypad" ||
      "pool table" ||
      "piggy bank" ||
      "billiard table"
    ) {
      /* Alert.alert("Found Something"); */
      /* if (modalVisible == false) {
        console.log("i got in here");
        setActiveModal(detections[1]);
        console.log(activeModal);
        setModalVisible(true);
      } */
    }
  }, [detections]);

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
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Image style={styles.itemImage} source={image} />
            <Text style={styles.modalHeaderText}>
              {title}
              {/*  {modalItem ? modalItem.id : ""} */}
            </Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>{text}</Text>
            {/* {modalItem ? (
            <Text style={styles.modalText}>{modalItem.text}</Text>
          ) : null} */}
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Gem</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#3f51b5",
  },
  modalHeaderText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  modalButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#3f51b5",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  itemImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});
