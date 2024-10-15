import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import CustomText from "./CustomText";
import { BlurView } from "expo-blur";
import RadioButton from "./RadioButton";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import LightBulb from "../assets/svg/light-bulb.svg";
import Cross from "../assets/svg/cross.svg";

const Quiz = ({quizOpen, setQuizOpen}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(12);

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <Modal transparent={true} visible={quizOpen} animationType="fade">
      <TouchableWithoutFeedback>
        <BlurView intensity={70} style={StyleSheet.absoluteFill}>
          <View style={styles.container}>
            <View style={styles.head}>
                <Pressable style={styles.headItem} onPress={() => setQuizOpen(false)}>
                    <Cross style={{color: "#000000"}}/>
                </Pressable>
            </View>
            <View style={styles.questionCard}>
              <CustomText style={styles.questionTitle}>
                Give the right answer to complete the match.
              </CustomText>
              <View style={styles.questionWrapper}>
                <AnimatedCircularProgress
                  size={56}
                  width={8}
                  fill={(timeLeft / 12) * 100}
                  tintColor="#FF524F"
                  backgroundColor="#000000"
                  style={styles.timer}
                >
                  {() => (
                    <CustomText style={styles.timerText}>{timeLeft}</CustomText>
                  )}
                </AnimatedCircularProgress>
                <CustomText style={styles.question}>
                  What Is The Name Of Phoebe's Sister?
                </CustomText>
              </View>
              <View style={styles.answers}>
                <RadioButton
                  key={1}
                  code="Jessica"
                  text="Jessica"
                  selectedItemIdSetter={setSelectedAnswer}
                  selected={"Jessica" === selectedAnswer ? true : false}
                />
                <RadioButton
                  key={2}
                  code="Ursula"
                  text="Ursula"
                  selectedItemIdSetter={setSelectedAnswer}
                  selected={"Ursula" === selectedAnswer ? true : false}
                />
                <RadioButton
                  key={3}
                  code="Emma"
                  text="Emma"
                  selectedItemIdSetter={setSelectedAnswer}
                  selected={"Emma" === selectedAnswer ? true : false}
                />
              </View>
              <View style={styles.hint}>
                <LightBulb />
                <CustomText style={styles.hintText}>Hint</CustomText>
              </View>
            </View>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  head: {
    marginBottom: 10
  },
  headItem: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFF1",
    alignSelf: "flex-end"
  },
  questionCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  questionTitle: {
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 32,
    color: "#000000",
    textAlign: "center",
    marginBottom: 50,
  },
  questionWrapper: {
    borderRadius: 12,
    backgroundColor: "#FFF5FE",
    paddingHorizontal: 46,
    paddingTop: 32,
    paddingBottom: 24,
    marginBottom: 32,
    position: "relative",
    alignItems: "center",
  },
  question: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
  },
  answers: {
    gap: 8,
    marginBottom: 32,
  },
  timer: {
    position: "absolute",
    top: "-56%",
  },
  timerText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    textAlign: "center",
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hintText: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#FF524F",
  },
});

export default Quiz;
