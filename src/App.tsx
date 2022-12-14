import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import { secretText, keyBetweenTime, showDataTime } from "./Common/global";
import Header from "./components/Header";
import Main from "./components/Main";
import { blogType } from "./Common/global";

function App() {
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);
  const pressKey = useRef<string>("");
  const startSecretType = useRef<boolean>(false);
  const [typeText, setTypeText] = useState("");
  const [showSecretText, setShowSecretText] = useState(false);
  const [showData, setShowData] = useState<Array<blogType>>([]);

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
    (data: Array<blogType>) => {
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
      const showTimer = setTimeout(() => {
        setShowSecretText((prevState) => (prevState = !prevState));
        setShowData([]);
      }, showDataTime);
      (async () => {
        await fetch("https://api.github.com/repos/elixir-lang/elixir/issues")
          .then((res) => {
            Promise.any([res.json()]).then((data) => {
              addShowData(data);
            });
          })
          .catch((err) => {
            throw err;
          });
      })();
      return () => {
        clearTimeout(showTimer);
      };
    }
  }, [showSecretText]);

  return (
    <div className="App">
      <Header />
      <Main showData={showData} visible={showSecretText} />
    </div>
  );
}

export default App;
