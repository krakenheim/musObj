import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

export default function PersonalScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>
      <View style={styles.profile}>
        <TouchableOpacity onPress={openModal}>
          <Image
            style={styles.profileImage}
            source={require("../../assets/images/profilePic.jpg")}
          />
        </TouchableOpacity>
        <Text style={styles.nameText}>Mig</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Followers</Text>
            <Text style={styles.statValue}>5,345</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Following</Text>
            <Text style={styles.statValue}>345</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Likes</Text>
            <Text style={styles.statValue}>34,567</Text>
          </View>
        </View>
        <Text style={styles.bioText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Edit Profile</Text>
          </View>
          <View style={styles.modalBody}>
            {/* Form to change personal information goes here */}
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#3f51b5",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profile: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3f51b5",
  },
  bioText: {
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 16,
    color: "#999",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
