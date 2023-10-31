import { User, WeightHistory } from "./Models";

class APIClient {
  constructor() {
    if (window.location.host === "localhost:3000") {
      this.env = "debug";
      this.baseUrl = "http://localhost:4000";
      this.frontEndBaseUrl = "http://localhost:3000";
      this.mode = "cors";
    } else {
      this.env = "production";
      this.baseUrl = `https://${window.location.host}`;
      this.mode = "same-origin";
    }
  }
  authenticateUser = async (authData) => {
    const requestUrl = `${this.baseUrl}/authenticate/user`;
    const request = new Request(requestUrl);

    const requestHeaders = new Headers();
    requestHeaders.set("user-id", authData.id);
    requestHeaders.set("password", authData.password);

    const requestParams = {
      method: "GET",
      mode: this.mode,
      headers: requestHeaders,
      cache: "default",
    };

    const response = await fetch(request, requestParams).catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
          })
          .catch(() => {
            console.log("Generic error from API");
            console.log(error.statusText);
          });
      } else {
        console.log("Fetch error in API");
        console.log(error);
      }
      return false;
    });

    if (response && response.status === 200) {
      const returnedUserJSON = await response.json().catch((error) => {
        console.log("error in producing json from response", error);
        return false;
      });
      if (returnedUserJSON) {
        const authenticatedUser = new User("snakeCase", returnedUserJSON);
        return authenticatedUser;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  createUser = async (userData) => {
    const requestUrl = this.baseUrl + "/user";

    const request = new Request(requestUrl);
    const requestParams = {
      method: "POST",
      body: JSON.stringify(userData),
      mode: this.mode,
      cache: "default",
    };
    const response = await fetch(request, requestParams).catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
          })
          .catch(() => {
            console.log("Generic error from API");
            console.log(error.statusText);
          });
      } else {
        console.log("Fetch error");
        console.log(error);
      }
      return false;
    });
    if (response) {
      return true;
    } else {
      return false;
    }
  };
  getUser = async (userId) => {
    const requestUrl = `${this.baseUrl}/user/${userId}`;
    const request = new Request(requestUrl);
    const requestParams = {
      method: "GET",
      mode: this.mode,
      cache: "default",
    };
    const response = await fetch(request, requestParams).catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
          })
          .catch(() => {
            console.log("Generic error from API");
            console.log(error.statusText);
          });
      } else {
        console.log("Fetch error in API");
        console.log(error);
      }
      return false;
    });
    if (response) {
      return response.status;
    } else {
      return false;
    }
  };

  getUserWeightHistory = async (userId) => {
    const requestUrl = `${this.baseUrl}/weight_history?user_id=${userId}`;
    const request = new Request(requestUrl);
    const requestParams = {
      method: "GET",
      mode: this.mode,
      cache: "default",
    };
    const response = await fetch(request, requestParams).catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
          })
          .catch(() => {
            console.log("Generic error from API");
            console.log(error.statusText);
          });
      } else {
        console.log("Fetch error in API");
        console.log(error);
      }
      return false;
    });

    if (response) {
      const weightHistoryJSONArray = await response.json().catch((error) => {
        console.log("error in producing json from response", error);
        return false;
      });
      const weightHistoryArray = [];
      if (weightHistoryJSONArray) {
        for (const weightHistoryJSON of weightHistoryJSONArray) {
          const newWeightHistory = new WeightHistory(
            "snakeCase",
            weightHistoryJSON
          );
          weightHistoryArray.push(newWeightHistory);
        }
        return weightHistoryArray;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  createWeightHistory = async (newWeightHistory) => {
    const requestUrl = `${this.baseUrl}/weight_history`;
    const request = new Request(requestUrl);
    const requestParams = {
      method: "POST",
      mode: this.mode,
      body: JSON.stringify(newWeightHistory),
      cache: "default",
    };
    const response = await fetch(request, requestParams).catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
          })
          .catch(() => {
            console.log("Generic error from API");
            console.log(error.statusText);
          });
      } else {
        console.log("Fetch error in API");
        console.log(error);
      }
      return false;
    });

    if (response) {
      return true;
    } else {
      return false;
    }
  };
  updateWeightHistory = async (newWeightHistory) => {
    const requestUrl = `${this.baseUrl}/weight_history`;
    const request = new Request(requestUrl);
    const requestParams = {
      method: "PUT",
      mode: this.mode,
      body: JSON.stringify(newWeightHistory),
      cache: "default",
    };
    const response = await fetch(request, requestParams).catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
          })
          .catch(() => {
            console.log("Generic error from API");
            console.log(error.statusText);
          });
      } else {
        console.log("Fetch error in API");
        console.log(error);
      }
      return false;
    });

    if (response) {
      return true;
    } else {
      return false;
    }
  };
  deleteWeightHistory = async (weightHistoryId) => {
    const requestUrl = `${this.baseUrl}/weight_history/${weightHistoryId}`;
    const request = new Request(requestUrl);
    const requestParams = {
      method: "DELETE",
      mode: this.mode,
      cache: "default",
    };
    const response = await fetch(request, requestParams).catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
          })
          .catch(() => {
            console.log("Generic error from API");
            console.log(error.statusText);
          });
      } else {
        console.log("Fetch error in API");
        console.log(error);
      }
      return false;
    });

    if (response) {
      return true;
    } else {
      return false;
    }
  };
  get networkErrorMessage() {
    return "An error occured. Please check your network connection and try again.";
  }
}
export default new APIClient();
