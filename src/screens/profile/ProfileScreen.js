import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Edit from "../../assets/svg/edit.svg";
import { useNavigation } from "@react-navigation/native";
import { getAccountDetails } from "../../services/User/get-user-account-detail";
import useUserStore from "../../store/useUserStore";
import MenuItem from "./components/MenuItem";

const menuData = [
  {
    id: "1",
    name: "Account Details",
    screen: "AccountDetails",
  },
  {
    id: "2",
    name: "Notification Preferences",
  },
  {
    id: "3",
    name: "Languages Preferences",
  },
  {
    id: "4",
    name: "Contact Us",
  },
  {
    id: "5",
    name: "Help",
  },
  {
    id: "6",
    name: "Restore Purchase",
  },
  {
    id: "7",
    name: "Terms & Conditions",
  },
  {
    id: "8",
    name: "Privacy Policy",
  },
  {
    id: "9",
    name: "Cookie Policy",
  },
];

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userStore = useUserStore();

  const menuItemPressHandler = (screen) => {
    navigation.navigate(`${screen}`)
  }

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getAccountDetails();
      
      userStore.setUserAccountDetails({
        profilePicture: response.account.profileImage.imageUrl,
        name: response.account.name,
        age: response.account.age,
        email: response.account.email,
        phoneNumber: response.account.phoneNumber
      });
    };
    getUserInfo();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 55 }}
      style={{
        paddingTop: insets.top,
        flex: 1,
      }}
    >
      <View>
        <View style={styles.profileHead}>
          <Image
            source={{ uri: userStore.userAccountDetails?.profilePicture }}
            style={styles.profil}
          />
          <CustomText style={styles.name}>
            {userStore.userAccountDetails &&
              `${userStore.userAccountDetails.name}, ${userStore.userAccountDetails.age}`}
          </CustomText>
          <Button
            variant="primary"
            prevIcon={<Edit />}
            style={{ width: "45%", paddingVertical: 8 }}
            onPress={() => navigation.navigate("EditProfile")}
          >
            Edit Profile
          </Button>
        </View>
      </View>
      <View style={styles.menu}>
        {menuData.map((item) => (
          <MenuItem key={item.id} name={item.name} onPress={() => menuItemPressHandler(item.screen)}/>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileHead: {
    alignItems: "center",
    gap: 16,
    marginTop: 12,
  },
  profil: {
    width: 80,
    height: 80,
    borderRadius: 999,
  },
  name: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
  },
  menu: {
    marginTop: 32,
  },
});

export default ProfileScreen;
