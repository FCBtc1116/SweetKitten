import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import { secretText, keyBetweenTime, showDataTime } from "./common/global";
import Header from "./components/Header";
import Main from "./components/Main";
import { BlogType } from "./common/global";

function App() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pressKey = useRef("");
  const startSecretType = useRef(false);
  const [typeText, setTypeText] = useState("");
  const [showSecretText, setShowSecretText] = useState(false);
  const [showData, setShowData] = useState<BlogType[]>([]);

  const resetState = () => {
    setTypeText("");
    startSecretType.current = false;
  };

  const handleUserKeyPress = useCallback(
    (event: any) => {
      const { key, keyCode } = event;
      pressKey.current = key;
      if (keyCode === 27) {
        resetState();
        return;
      } else if (keyCode === 73) {
        startSecretType.current = true;
        setTypeText(key);
        intervalRef.current && clearTimer();
        startTimer();
        return;
      }

      if (startSecretType.current) {
        intervalRef.current && clearTimer();
        if (typeText.length > secretText.length) {
          resetState();
          return;
        }
        setTypeText(typeText + key);
        startTimer();
      }
    },
    [pressKey.current]
  );

  const addShowData = useCallback(
    (data: BlogType[]) => {
      data.map((item: any, _index: number) => {
        if (_index >= 5) return;
        setShowData((t) => [
          ...t,
          { title: item.title, user: item.user.login },
        ]);
      });
    },
    [showData]
  );

  const startTimer = () => {
    const timer = setTimeout(() => {
      resetState();
      clearTimer();
    }, keyBetweenTime);
    intervalRef.current = timer;
  };

  const clearTimer = () => {
    clearTimeout(intervalRef.current as NodeJS.Timeout);
  };

  useEffect(() => {
    if (typeText === secretText) {
      setShowSecretText((prevState) => (prevState = !prevState));
      resetState();
      return;
    }

    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress, typeText]);

  useEffect(() => {
    if (showSecretText) {
      const showDataTimer = setTimeout(() => {
        setShowSecretText((prevState) => (prevState = !prevState));
        setShowData([]);
      }, showDataTime);
      (async () => {
        await fetch(
          "https://api.github.com/repos/elixir-lang/elixir/issues"
        ).then((res) => {
          Promise.any([res.json()]).then((data) => {
            addShowData(data);
          });
        });
      })();
      return () => {
        clearTimeout(showDataTimer);
      };
    }
  }, [showSecretText]);

  return (
    <div className="App">
      <Header />
      <Main blogDatas={showData} visible={showSecretText} />
    </div>
  );
}

export default App;
