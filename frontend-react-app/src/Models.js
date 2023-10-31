import { capitalize } from "@mui/material";
import { v4 as uuid } from "uuid";

export const testIfNumber = (number) => {
  return /^[0-9]+(\.)?[0-9]*$/.test(number);
};

export class User {
  constructor(objectCoding, object) {
    if (objectCoding === "snakeCase") {
      this.id = object.id;
      this.password = object.password;
      this.firstName = object.first_name;
      this.lastName = object.last_name;
      this.startingWeight = parseFloat(object.startingWeight);
      this.accountCreationDatetime = object.account_creation_datetime * 1000;
      this.active = object.active;
    } else if (objectCoding === "camelCase") {
      this.id = object.id;
      this.password = object.password;
      this.firstName = object.firstName;
      this.lastName = object.lastName;
      this.startingWeight = parseFloat(object.startingWeight);
      this.accountCreationDatetime = object.accountCreationDatetime;
      this.active = object.active;
    } else {
      this.id = "";
      this.password = "";
      this.firstName = "";
      this.lastName = "";
      this.startingWeight = "";
      this.accountCreationDatetime = Date.now();
      this.active = true;
    }
  }

  get name() {
    return this.firstName + " " + this.lastName;
  }
  get formattedName() {
    return `${capitalize(this.firstName)} ${capitalize(this.lastName)}`;
  }

  toJSON() {
    const data = {
      id: this.id,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
      starting_weight: this.startingWeight,

      // Convert from miliseconds to seconds for python interpretation in backend
      account_creation_datetime: this.accountCreationDatetime / 1000,
      active: this.active,
    };
    return data;
  }
}
export class WeightHistory {
  constructor(objectCoding, object) {
    if (objectCoding === "snakeCase") {
      this.id = object.id;
      this.userId = object.user_id;
      this.weight = object.weight;
      this.date = new Date(parseFloat(object.date) * 1000);
      console.log("this.date", this.date);
      const timething = this.date.getTime();
      console.log("timething", timething);
      this.notes = object.notes;
    } else if (objectCoding === "camelCase") {
      this.id = object.id;
      this.userId = object.userId;
      this.weight = object.weight;
      this.date = object.date;
      this.notes = object.notes;
    } else {
      this.id = uuid();
      this.userId = "";
      this.weight = "";
      this.date = new Date();
      this.notes = "";
    }
  }
  toJSON() {
    const data = {
      id: this.id,
      user_id: this.userId,
      weight: this.weight,
      date: this.date.getTime() / 1000,
      notes: this.notes,
    };
    return data;
  }
}

export class WeightHistoryItem {
  constructor(object) {
    this.weight = object.weight;
    this.date = object.date;
    this.notes = object.notes;
  }
  get formattedDate() {
    return `${this.date.getMonth() + 1}/${this.date.getDate()}`;
  }
  get formattedWeight() {
    return this.weight.toFixed(1);
  }
}
