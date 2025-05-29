import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import MenuItem from "../../components/MenuItem";
import useUserStore from "../../store/useUserStore";
import PremiumAlertSheet from "../../components/PremiumAlertSheet";
import PremiumSheet from "../../components/PremiumSheet";
import Back from "../../assets/svg/arrow-left.svg";
import * as SecureStore from "expo-secure-store";
import Button from "../../components/Button";
import { createMatchFilter } from "../../services/Matching/create-match-filter";

const CustomMarker = ({ enabled, pressed }) => {
  return (
    <View
      style={{
        height: 18,
        width: 18,
        borderRadius: 12,
        backgroundColor: "#FF524F",
        borderWidth: 2,
        borderColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }}
    />
  );
};

const FilterScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const storedObject = JSON.parse(SecureStore.getItem("filter_data"));
  const [ageRange, setAgeRange] = useState(userStore?.filters?.Age || [18, 70]);
  const [distance, setDistance] = useState(userStore?.filters?.Distance || 500);
  const sheetRef = useRef(null);
  const premiumSheetRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const menuData = [
    {
      id: "1",
      name: t("INTEREST"),
      screen: "SetFilterInterests",
      key: "Interest",
    },
    {
      id: "2",
      name: t("LOOKINGFOR"),
      screen: "SetFilterLookingFors",
      key: "LookingFor",
    },
    {
      id: "3",
      name: t("HEIGHT"),
      screen: "",
      key: "",
    },
    {
      id: "4",
      name: t("DRINKINGHABIT"),
      screen: "SetFilterDrinkingHabits",
      key: "DrinkingHabit",
    },
    {
      id: "5",
      name: t("SMOKER"),
      screen: "SetFilterSmokerHabits",
      key: "Smoker",
    },
    {
      id: "6",
      name: t("ZODIAC"),
      screen: "SetFilterZodiac",
      key: "Zodiac",
    },
    {
      id: "7",
      name: t("EDUCATION"),
      screen: "SetFilterEducation",
      key: "Education",
    },
  ];

  const menuItemPressHandler = (screen) => {
    navigation.navigate(`${screen}`);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={saveBtnPressHandler}>
          <CustomText>{t("SAVE")}</CustomText>
        </Pressable>
      ),
      headerLeft: () => (
        <Pressable
          onPress={backBtnPressHandler}
          style={{ padding: 10, paddingLeft: 0 }}
        >
          <Back />
        </Pressable>
      ),
    });
  }, [navigation, userStore.filters, ageRange, distance]);

  const hasDifference = (storedObject, newObject) => {
    if (storedObject === null && Object.keys(newObject).length > 0) return true;

    for (const key in storedObject) {
      // Eğer yeni objede bu anahtar yoksa fark vardır.
      if (!(key in newObject)) return true;

      const storedValue = storedObject[key];
      const newValue = newObject[key];

      if (Array.isArray(storedValue) && Array.isArray(newValue)) {
        // Dizileri kontrol et: uzunluk ve elemanlar aynı mı?
        if (
          storedValue.length !== newValue.length ||
          !storedValue.every((value) => newValue.includes(value))
        ) {
          return true;
        }
      } else if (storedValue !== newValue) {
        // Basit tiplerde doğrudan karşılaştır
        return true;
      }
    }

    // Yeni objede fazladan anahtar varsa fark vardır.
    for (const key in newObject) {
      if (!(key in storedObject)) return true;
    }

    return false; // Hiçbir fark bulunmadı.
  };

  const resetFilterPressHandler = async () => {
    userStore.resetFilters();
    await SecureStore.setItemAsync("filter_data", JSON.stringify({}));
    await SecureStore.setItemAsync("filter_identifier", "");
    setModalVisible(false);
    navigation.navigate('Explore', { updated: true });
  };

  const resetFilterBtnPressHandler = async () => {
    userStore.resetFilters();
    await SecureStore.setItemAsync("filter_data", JSON.stringify({}));
    await SecureStore.setItemAsync("filter_identifier", "");
  }

  const backBtnPressHandler = async () => {
    const hasDiff = hasDifference(storedObject, userStore.filters);

    if (hasDiff) {
      setModalVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const saveBtnPressHandler = async () => {
    if (userStore.isUserPremium) {
      const data = {
        minimumAge: userStore.filters.Age
          ? userStore.filters.Age[0]
          : ageRange[0],
        maximumAge: userStore.filters.Age
          ? userStore.filters.Age[1]
          : ageRange[1],
        gender: "",
        distance: userStore.filters.Distance || distance,
        additionalFilters: Object.keys(userStore.filters)
          .filter((key) => key !== "Age" && key !== "Distance")
          .map((key) => ({
            filterType: key,
            values: userStore.filters[key],
          })),
      };

      const response = await createMatchFilter(data);

      await SecureStore.setItemAsync(
        "filter_data",
        JSON.stringify(userStore.filters)
      );
      await SecureStore.setItemAsync("filter_identifier", response.identifier);
      navigation.navigate('Explore', { updated: true });
    } else {
      sheetRef.current?.present();
    }
  };

  const handleAgeChange = (values) => {
    setAgeRange(values);
    userStore.setFilters("Age", values);
  };

  const handleDistanceChange = (values) => {
    setDistance(values[1]);
    userStore.setFilters("Distance", values[1]);
  };

  const sheetProps = {
    img: require("../../assets/images/premium-likes.png"),
    title: t("PREMIUM_SEE_LIKES"),
    desc: t("PREMIUM_SEE_LIKES_DESC"),
    btnText: t("DISCOVER"),
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <CustomText style={styles.sectionTitle}>{`${t("PREMIUM")} ${t(
          "PREFERENCES"
        )}`}</CustomText>
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <View style={styles.filterRowHead}>
              <CustomText style={styles.label}>{t("AGE")}</CustomText>
              <CustomText style={styles.label}>
                {ageRange[0]}-{ageRange[1]}
              </CustomText>
            </View>
            <View style={styles.sliderWrapper}>
              <MultiSlider
                values={ageRange}
                sliderLength={Dimensions.get("window").width - 64}
                onValuesChange={handleAgeChange}
                min={18}
                max={70}
                step={1}
                allowOverlap={false}
                snapped
                trackStyle={styles.track}
                selectedStyle={styles.selectedTrack}
                customMarker={CustomMarker}
              />
            </View>
          </View>

          <View>
            <View style={styles.filterRowHead}>
              <CustomText style={styles.label}>{t("DISTANCE")}</CustomText>
              <CustomText style={styles.label}>{distance} km</CustomText>
            </View>
            <View style={styles.sliderWrapper}>
              <MultiSlider
                values={[0, distance]}
                sliderLength={Dimensions.get("window").width - 64}
                onValuesChange={handleDistanceChange}
                min={0}
                max={500}
                step={1}
                allowOverlap={false}
                snapped
                trackStyle={styles.track}
                selectedStyle={styles.selectedTrack}
                customMarker={CustomMarker}
                enabledOne={false}
                enabledTwo={true}
              />
            </View>
          </View>
        </View>
        <View style={styles.menuItems}>
          {menuData.map((item) => (
            <MenuItem
              key={item.id}
              name={item.name}
              onPress={() => menuItemPressHandler(item.screen)}
              selectedCount={userStore.filters?.[item.key]?.length || null}
            />
          ))}
        </View>
        <View style={styles.btnWrapper}>
          <Button variant="danger" onPress={resetFilterBtnPressHandler}>{t("RESET_MY_FILTER")}</Button>
        </View>
      </ScrollView>
      <PremiumAlertSheet
        sheetProps={sheetProps}
        sheetRef={sheetRef}
        premiumSheetRef={premiumSheetRef}
      />
      <PremiumSheet sheetRef={premiumSheetRef} />
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <CustomText style={styles.modalTitle}>
              {t("RESET_FILTER_TITLE")}
            </CustomText>
            <CustomText style={styles.modalDesc}>
              {t("RESET_FILTER_DESC")}
            </CustomText>
            <View style={styles.btns}>
              <Button variant="danger" onPress={resetFilterPressHandler}>
                {t("RESET_MY_FILTER")}
              </Button>
              <Button variant="ghost" onPress={() => setModalVisible(false)}>
                {t("CANCEL")}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 32,
    marginBottom: 16,
  },
  filterSection: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    marginBottom: 32,
  },
  filterRow: {
    borderBottomWidth: 1,
    borderColor: "#D1D1D6",
  },
  filterRowHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
  },
  sliderWrapper: {
    alignItems: "center",
  },
  track: {
    height: 3,
    backgroundColor: "#E4E4E7",
    borderRadius: 2,
  },
  selectedTrack: {
    backgroundColor: "#FF524F",
  },
  menuItems: {
    marginBottom: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 22,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  modalDesc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    textAlign: "center",
  },
  btns: {
    marginTop: 32,
    gap: 8,
  },
  btnWrapper: {
    marginBottom: 48
  }
});

export default FilterScreen;
