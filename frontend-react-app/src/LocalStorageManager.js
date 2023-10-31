import { User, WeightHistory } from "./Models";

const defineLazyProperty = (propertyName, localStorageName, propertyType) =>
  // Define a computed property on LocalStorageManager prototype using the propertyName
  // This allows the property to be lazy, because computed properties are not set but rather are determined when called
  // This property is defined in the LocalStorage constructor
  Object.defineProperty(LocalStorageManager.prototype, propertyName, {
    get: function () {
      // The propertyType function is acting as a lazy accessor for the object's class name. If the class name is given directly, the class will not have been initialized yet
      const ClassName = propertyType();
      const objectArray = [];

      // If the object exists in localStorage memory
      if (this.getItem(localStorageName)) {
        // Parse the data from localStorage into the model class
        this.getItem(localStorageName).forEach((objectJSON) =>
          objectArray.push(new ClassName("snakeCase", objectJSON))
        );
      }
      // When this property is accessed for the first time
      // Redefine the property on the shared LocalStorageManager instance using the cached localStorage data
      // Future calls to the property will return the static data in the objectArray, reducing overhead
      Object.defineProperty(this, propertyName, {
        value: objectArray,
        configurable: true,
        enumerable: true,
      });
      return objectArray;
    },
  });

class LocalStorageManager {
  static shared = (() => {
    // If an instance already exists in memory then return that instance
    if (LocalStorageManager._instance) {
      return LocalStorageManager._instance;
    } else {
      // Otherwise return a new instance
      return new LocalStorageManager();
    }
  })();

  constructor() {
    this.storage = localStorage;
    // Define weightHistory cache upon initialization
    defineLazyProperty("_weightHistory", "weight_history", () => WeightHistory);
  }

  getRawItem(key) {
    return this.storage.getItem(key);
  }

  setRawItem(key, object) {
    this.storage.setItem(key, object);
  }

  getItem(key) {
    const itemJSON = this.getRawItem(key);
    if (itemJSON) {
      return JSON.parse(this.getRawItem(key));
    } else {
      return false;
    }
  }

  setItem(key, object) {
    if (object) {
      this.setRawItem(key, JSON.stringify(object));
    }
  }

  removeItem(key) {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  }

  get weightHistory() {
    return this._weightHistory;
  }

  set weightHistory(newWeightHistory) {
    this.setItem("weight_history", newWeightHistory);
  }

  get currentUser() {
    if (this.getItem("current_user")) {
      const currentUser = new User("snakeCase", this.getItem("current_user"));
      return currentUser;
    } else {
      return false;
    }
  }

  set currentUser(newCurrentUser) {
    this.setItem("current_user", newCurrentUser);
  }

  get developmentEnv() {
    if (window.location.host === "localhost:3000") {
      return "debug";
    } else if (window.location.host.contains("test")) {
      return "production_debug";
    } else {
      return "production";
    }
  }

  get days() {
    return [
      "Sunday",

      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  }

  get months() {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  }
  getCurrentMonths(year) {
    const today = new Date();
    if (today.getFullYear() === year) {
      const historicalMonthsInCurrentYear = [];
      for (const i in this.months) {
        if (today.getMonth() >= i) {
          historicalMonthsInCurrentYear.push(this.months[i]);
        }
      }
      return historicalMonthsInCurrentYear;
    } else {
      return this.months;
    }
  }
  logOutUser() {
    localStorage.clear();
  }
}
export default LocalStorageManager;
