import { useState, useEffect } from "react";
import APIClient from "../APIClient";
import LocalStorageManager from "../LocalStorageManager";
import Dashboard from "./Dashboard";

const HomeContainer = () => {
  // if there is no current weightHistory then it needs to be updated in useEffect, otherwise set it using the cached value in localStorage
  const [userWeightHistory, setUserWeightHistory] = useState(
    LocalStorageManager.shared.weightHistory.length === 0
      ? false
      : LocalStorageManager.shared.weightHistory
  );

  // get weightHistory from the backend and update localStorage
  const updateWeightHistory = () => {
    APIClient.getUserWeightHistory(
      LocalStorageManager.shared.currentUser.id
    ).then((response) => {
      if (!response) {
        alert(APIClient.networkErrorMessage);
      } else {
        const sortedWeightHistory = response.sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        );
        LocalStorageManager.shared.weightHistory = sortedWeightHistory;
        setUserWeightHistory(sortedWeightHistory);
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    // Only pull new data if there is no cache
    if (LocalStorageManager.shared.weightHistory.length === 0 && mounted) {
      updateWeightHistory();
    }
    return () => (mounted = false);
  }, []);

  if (userWeightHistory) {
    return (
      <Dashboard
        weightHistory={userWeightHistory}
        updateWeightHistory={updateWeightHistory}
      ></Dashboard>
    );
  } else {
    return <></>;
  }
};
export default HomeContainer;
