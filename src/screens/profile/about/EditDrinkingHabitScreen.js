import { t } from 'i18next';
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import useUserStore from '../../../store/useUserStore';
import { postUserAbouts } from '../../../services/User/send-user-about';
import RadioButton from '../../../components/RadioButton';

const drinkingHabitData = [
    {
      id: "1",
      name: t("Never"),
      key: "Never",
    },
    {
      id: "2",
      name: t("Rarely"),
      key: "Rarely",
    },
    {
      id: "3",
      name: t("SocialDrinker"),
      key: "SocialDrinker",
    },
    {
      id: "4",
      name: t("RegularDrinker"),
      key: "RegularDrinker",
    },
    {
      id: "5",
      name: t("HeavyDrinker"),
      key: "HeavyDrinker",
    },
    {
      id: "6",
      name: t("Occasionally"),
      key: "Occasionally",
    },
  ];

const EditDrinkingHabitScreen = () => {
    const userStore = useUserStore();
    const [selectedDrinkingHabit, setSelectedDrinkingHabit] = useState(
      userStore.userAbouts.find((item) => item.title === "DrinkingHabit")
        ?.values[0]
    );
    const initialDrinkingHabit = userStore.userAbouts.find(
      (item) => item.title === "DrinkingHabit"
    )?.values[0];
  
    useEffect(() => {
      const setDrinkingHabit = async () => {
        const data = {
          title: "DrinkingHabit",
          values: [`${selectedDrinkingHabit}`],
        };
  
        const response = await postUserAbouts(data);
  
        if (response.isSuccess) {
          userStore.setUserAbouts([data]);
        }
      };
      if (initialDrinkingHabit !== selectedDrinkingHabit) {
        setDrinkingHabit();
      }
    }, [selectedDrinkingHabit]);
  
    return (
      <View style={styles.container}>
        <View style={styles.boxes}>
          {drinkingHabitData.map((item) => (
            <RadioButton
              key={item.id}
              code={item.key}
              text={item.name}
              selectedItemIdSetter={setSelectedDrinkingHabit}
              selected={item.key === selectedDrinkingHabit ? true : false}
            />
          ))}
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
      paddingHorizontal: 16
    },
    boxes: {
      gap: 8,
    },
  });

export default EditDrinkingHabitScreen