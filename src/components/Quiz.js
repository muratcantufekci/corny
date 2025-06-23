import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  Image,
} from "react-native";
import CustomText from "./CustomText";
import { BlurView } from "expo-blur";
import RadioButton from "./RadioButton";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import LightBulb from "../assets/svg/light-bulb.svg";
import ConfettiCannon from "react-native-confetti-cannon";
import { t } from "i18next";
import useUserStore from "../store/useUserStore";
import { useConsumable } from "../services/Consumable/use-consumable";
import usePremiumPackagesStore from "../store/usePremiumPackagesStore";
import { mapRevenueCatDataToStaticFormat } from "../helper/rcDataToStatic";

const Quiz = ({
  quizOpen,
  setQuizOpen,
  quiz,
  setQuizAnswer,
  quizAnswer,
  setShouldOpenUtilitySheet,
  setUtilitySheetProps,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(12);
  const [showConfetti, setShowConfetti] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [wrongAnswerText, setWrongAnswerText] = useState("");
  const userStore = useUserStore();
  const premiumStore = usePremiumPackagesStore();
  const superlikeSubscriptionData = mapRevenueCatDataToStaticFormat(
    premiumStore.superlikePackages,
    "superlike"
  );
  const jokerSubscriptionData = mapRevenueCatDataToStaticFormat(
    premiumStore.jokerPackages,
    "joker"
  );

  const options = [
    {
      key: 1,
      code: quiz.Option_A,
      text: quiz.Option_A,
      isCorrect: quiz.CorrectAnswer === quiz.Option_A,
    },
    {
      key: 2,
      code: quiz.Option_B,
      text: quiz.Option_B,
      isCorrect: quiz.CorrectAnswer === quiz.Option_B,
    },
    {
      key: 3,
      code: quiz.Option_C,
      text: quiz.Option_C,
      isCorrect: quiz.CorrectAnswer === quiz.Option_C,
    },
  ];

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => {
        setBtnDisable(true);
        setWrongAnswerText("QUIZ_TIMEOUT");
        setQuizAnswer({ answer: false });
      }, 600);
      setTimeout(() => {
        setQuizOpen(false);
        setQuizAnswer(null);
      }, 2600);
      return;
    }
    const intervalId = setInterval(() => {
      if (quizAnswer === null) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, quizAnswer]);

  const handleAnswerSelection = (answer) => {
    setBtnDisable(true);
    setSelectedAnswer(answer.code);
    if (answer.isCorrect) {
      setShowConfetti(true);
      setQuizAnswer({ answer: true, isSuperlike: false });
    } else {
      setWrongAnswerText("QUIZ_WRONG");
      setQuizAnswer({ answer: false });
    }
    setTimeout(() => {
      setQuizOpen(false);
      setQuizAnswer(null);
    }, 4000);
  };

  const handleHint = async () => {
    if (hintCount >= 2) return;

    if (userStore.jokerCount > 0) {
      const incorrectOptions = options.filter(
        (option) => !option.isCorrect && !disabledOptions.includes(option.code)
      );

      if (incorrectOptions.length === 0) return;

      const randomWrongOption =
        incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

      setDisabledOptions((prev) => [...prev, randomWrongOption.code]);
      setHintCount((prev) => prev + 1);
      userStore.setJokerCount(userStore.jokerCount - 1);
      const response = await useConsumable({ consumableType: "Hint" });
    } else {
      setUtilitySheetProps({
        img: require("../assets/images/boost.png"),
        title: "Joker",
        desc: t("JOKER_SHEET_DESC"),
        backgroundColor: "#FFE6E5",
        subscriptionData: jokerSubscriptionData,
        boxBorderColor: "#FF0A00",
        selectedBoxColor: "#FFB5B2",
        unselectedBoxColor: "#FFFFFF",
        text: "JOKER",
      });
      setShouldOpenUtilitySheet(true);
    }
  };

  const useSuperlikePressHandler = () => {
    if (userStore.superlikeCount > 0) {
      setShowConfetti(true);
      setQuizAnswer({ answer: true, isSuperlike: true });
    } else {
      setUtilitySheetProps({
        img: require("../assets/images/superlike.png"),
        title: "Superlike",
        desc: t("SUPERLIKE_SHEET_DESC"),
        backgroundColor: "#FFF0D7",
        subscriptionData: superlikeSubscriptionData,
        boxBorderColor: "#FF9F00",
        selectedBoxColor: "#FFCF80",
        unselectedBoxColor: "#FFFFFF",
        text: "SUPERLIKE",
      });
      setShouldOpenUtilitySheet(true);
      setQuizOpen(false);
      setQuizAnswer(null);
    }
  };

  return (
    <Modal transparent={true} visible={quizOpen} animationType="fade">
      <TouchableWithoutFeedback>
        <BlurView
          intensity={70}
          style={StyleSheet.absoluteFill}
          experimentalBlurMethod="dimezisBlurView"
        >
          <View style={styles.container}>
            <View style={styles.questionCard}>
              <CustomText style={styles.questionTitle}>
                {t("QUIZ_TITLE")}
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
                <CustomText style={styles.question}>{quiz.Question}</CustomText>
              </View>
              <View style={styles.answers}>
                {options.map((option) => (
                  <RadioButton
                    key={option.key}
                    code={option.code}
                    text={option.text}
                    selectedItemIdSetter={() => handleAnswerSelection(option)}
                    selected={option.text === selectedAnswer}
                    disable={
                      btnDisable || disabledOptions.includes(option.code)
                    }
                  />
                ))}
              </View>
              {quizAnswer?.answer === false && (
                <View style={styles.superlikeWrapper}>
                  <Pressable
                    style={styles.superlike}
                    onPress={useSuperlikePressHandler}
                  >
                    <Image
                      source={require("../assets/images/superlike.png")}
                      style={styles.superlikeImg}
                    />
                    <CustomText style={styles.superlikeText}>
                      ( {userStore.superlikeCount} )
                    </CustomText>
                  </Pressable>
                </View>
              )}
              {quizAnswer?.answer !== false && (
                <Pressable
                  style={styles.hint}
                  onPress={handleHint}
                  disabled={hintCount >= 2}
                >
                  <LightBulb
                    style={{ color: hintCount >= 2 ? "#70707B" : "#FF524F" }}
                  />
                  <CustomText
                    style={[
                      styles.hintText,
                      hintCount >= 2 && styles.hintUsedText,
                    ]}
                  >
                    Joker ( {userStore.jokerCount} )
                  </CustomText>
                </Pressable>
              )}
              {quizAnswer?.answer === false && (
                <CustomText style={styles.wrongAnswerText}>
                  {t(wrongAnswerText)}
                </CustomText>
              )}
            </View>
            {showConfetti && (
              <ConfettiCannon
                count={100}
                origin={{ x: 0, y: 0 }}
                fadeOut={true}
                explosionSpeed={200}
                fallSpeed={2000}
                onAnimationEnd={() => setShowConfetti(false)} // Animasyon bitince gizle
              />
            )}
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
    paddingHorizontal: 24,
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
    minHeight: 72,
  },
  answers: {
    gap: 8,
    marginBottom: 32,
  },
  timer: {
    position: "absolute",
    top: "-40%",
  },
  timerText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    textAlign: "center",
  },
  superlikeWrapper: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  superlike: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
    backgroundColor: "#6862bf",
    borderRadius: 8,
  },
  superlikeImg: {
    width: 24,
    height: 24,
  },
  superlikeText: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "white",
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  hintText: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#FF524F",
  },
  hintUsedText: {
    color: "#70707B",
  },
  wrongAnswerText: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "black",
    textAlign: "center",
  },
});

export default Quiz;
