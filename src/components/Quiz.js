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
import ConfettiCannon from "react-native-confetti-cannon";
import { t } from "i18next";

const Quiz = ({ quizOpen, setQuizOpen, quiz, setQuizAnswer, quizAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(12);
  const [showConfetti, setShowConfetti] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [disabledOption, setDisabledOption] = useState(null);
  const [wrongAnswerText, setWrongAnswerText] = useState("");

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
        setWrongAnswerText("QUIZ_TIMEOUT")
        setQuizAnswer(false);
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
      setQuizAnswer(true);
    } else {
      setWrongAnswerText("QUIZ_WRONG");
      setQuizAnswer(false);
    }
    setTimeout(() => {
      setQuizOpen(false);
      setQuizAnswer(null);
    }, 2000);
  };

  const handleHint = () => {
    if (hintUsed) return;
    const incorrectOptions = options.filter((option) => !option.isCorrect);
    const randomWrongOption =
      incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
    setDisabledOption(randomWrongOption.code);
    setHintUsed(true);
  };

  return (
    <Modal transparent={true} visible={quizOpen} animationType="fade">
      <TouchableWithoutFeedback>
        <BlurView intensity={70} style={StyleSheet.absoluteFill}>
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
                    disable={btnDisable || option.code === disabledOption}
                  />
                ))}
              </View>
              <Pressable
                style={styles.hint}
                onPress={handleHint}
                disabled={hintUsed}
              >
                <LightBulb
                  style={{ color: hintUsed ? "#70707B" : "#FF524F" }}
                />
                <CustomText
                  style={[styles.hintText, hintUsed && styles.hintUsedText]}
                >
                  {t("HINT")}
                </CustomText>
              </Pressable>
              {quizAnswer === false && (
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
