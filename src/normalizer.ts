import axios from "axios";

enum EContactMethod {
  phone = "phone",
  email = "email",
  none = 'none'
}

// The interface to which all response records should conform after you are finished with your implementation
export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  primaryPhone?: string;
  roles: string[];
  preferredContactMethod?: EContactMethod;
  // added
  isVaildEmailFormat?: boolean ;
  isVaildPhoneNumber?: boolean; // not set in this assessment
}


export async function normalize(): Promise<UserRecord> {
  const url = `https://us-central1-txtsmarter-dev.cloudfunctions.net/codeassessment/user`;
  const options =  {
    url,
    headers: {
      "Authorization": `Bearer ${process.env.AUTH_TOKEN}`,
    }
  }

  // Creating Default UserRecord
  const user: UserRecord = {
    id: "", fullName: "", email: "", isActive: false, createdAt: "", roles: [], primaryPhone: "", preferredContactMethod: EContactMethod.none
  }

  // Get response and check for null/undefined value
  const response = await axios(options);
  if (response == null){ throw new Error("response is null/undefined"); }

  // Get data and check for null/undefined value and other data checks
  const legacyData = response.data;
  if (legacyData == null){ throw new Error("response data is null/undefined"); }

  // For testing
  console.log(legacyData);

  const emailFormatRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const activeRegex = /^(a|ok|active)$/i;
  const dateRegex = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
  const dateISORegex = /^(\d{4})[-/](\d{2})[-/](\d{4})$/;
  const dateDelineator = /[-/]/;
  const useridPropertyRegex = /(user|id)/i;
  const fullNamePropertyRegex = /(full|name)/i;
  const fullNamePropertyFirstRegex = /(first)/;
  const fullNamePropertyLastRegex =  /(last)/i;
  const emailPropertyRegex = /(email|e-mail)/i;
  const statusPropertyRegex = /(account|status)/i;
  const createdAtPropertyRegex = /(created|joined)/i;
  const phonePropertyRegex = /\bcontact\b|phone/i;
  const phonePrefRegex = /(preferred)/i;
  const preferredContactPhoneRegex = /(phone)/i;
  const preferredContactEmailRegex = /(email)/i;
  const rolesPropertyRegex = /(role)/i;
  const preferredContactPropertyRegex = /(preferred|prefContact)/i;


  // Parsing Property Names
  const keys = Object.keys(legacyData);

  for (const key in keys) {
    const propertyName = keys[key];
    const dataValue = legacyData[propertyName];

    // For testing
    console.log("Parsing Property",key, propertyName, dataValue);

    switch (true) {

      // user.id
      case useridPropertyRegex.test(propertyName):
        user.id = dataValue.toString();
        break;

      // user.fullName
      case fullNamePropertyRegex.test(propertyName):
        switch (typeof dataValue){
          case "object":
            const subkeys = Object.keys(dataValue);
            const name = { first: "", last: "", print: function(){
              return this.first + " " + this.last; break; 
            }};

            for (const sub in subkeys) {
              const propertySubName = subkeys[sub];
              switch (true) {
                case fullNamePropertyFirstRegex.test(propertySubName):
                  name.first = dataValue[propertySubName];
                  break;
                case fullNamePropertyLastRegex.test(propertySubName):
                  name.last = dataValue[propertySubName];
                  break;
                default: break;
              }
            }
            user.fullName = name.print();
            break;
          case "string":
            user.fullName = dataValue;
            break;
          default:
        }
        break;

      // user.email
      case emailPropertyRegex.test(propertyName):
        user.email = dataValue.toString();
        user.isVaildEmailFormat = emailFormatRegex.test(user.email);
        break;

      // user.isActive
      case statusPropertyRegex.test(propertyName):
        user.isActive = activeRegex.test(dataValue);
        break;

      // user.createdAt
      case createdAtPropertyRegex.test(propertyName):
        //  Milliseconds
        if(typeof dataValue == "number"){
          user.createdAt = new Date(dataValue).toISOString(); break;
        }
        // YYYY-MM-DD
        if(dateISORegex.test(dataValue)){
          const dateArray = dataValue.split(dateDelineator);
          user.createdAt = new Date(dateArray[0], dateArray[1]-1, dateArray[2]).toISOString();
          break;
        }
        // 00-00-YYYY
        if(dateRegex.test(dataValue)){
          const dateArray = dataValue.split(dateDelineator);
          const part1 = dateArray[0]<13;
          const part2 = dateArray[1]<13;

          // Assume MM-DD-YYYY if both are under 13
          if(part1 && part2 || part1 && !part2){
            user.createdAt = new Date(dateArray[2], dateArray[0]-1, dateArray[1]).toISOString();
            break;
          } else if (!part1 && part2) {
            user.createdAt = new Date(dateArray[2], dateArray[1]-1, dateArray[0]).toISOString();
            break;
          } else {
            console.log("Invalid Date format", dataValue, user.id, user.fullName);
            user.createdAt = new Date().toISOString();
            break;
          }
        }
        break;

      // primaryPhone
      case phonePropertyRegex.test(propertyName):
        //////////////////////////////////////////////////////////////////////////////////////////////
        //  isVaildPhoneNumber could be checked below.
        //  Not set in this assessment. Ain't nobody got time for that!
        //////////////////////////////////////////////////////////////////////////////////////////////
        switch (typeof dataValue) {

          case "string":
            user.primaryPhone = dataValue;
            break;

          case "object":
            const subkeys = Object.keys(dataValue);
            for (const sub in subkeys) {
              const propertySubName = subkeys[sub];

              switch (true) {
                case preferredContactPhoneRegex.test(propertySubName):
                  user.primaryPhone = dataValue[propertySubName];
                  break;
                case phonePrefRegex.test(propertySubName):
                  if(preferredContactPhoneRegex.test(dataValue[propertySubName])){
                    user.preferredContactMethod = EContactMethod.phone;
                  } else if (preferredContactEmailRegex.test(dataValue[propertySubName])){
                    user.preferredContactMethod = EContactMethod.email;
                  } else {
                    user.preferredContactMethod = EContactMethod.none;
                  }
                  break;
                default:
                  user.primaryPhone = dataValue[0]; // defaults to first item in phones
                  break;
              }
            }
            break;

          default:
             break;
        }
        break;

      // user.roles
      case rolesPropertyRegex.test(propertyName):
        if(typeof dataValue == "object"){
          user.roles = dataValue;
        }else{
          user.roles = new Array(dataValue);
        }
        break;

      //  user.preferredContactMethod
      case preferredContactPropertyRegex.test(propertyName):
        switch (true){
          case preferredContactPhoneRegex.test(dataValue):
            user.preferredContactMethod = EContactMethod.phone;
            break;
          case preferredContactEmailRegex.test(dataValue):
            user.preferredContactMethod = EContactMethod.email;
            break;
          default:
            user.preferredContactMethod = EContactMethod.none;
            break;
        }
        break;

      default:
        // add logging for unmatched property names. queue for human intervention 
        break;
    }

  }
  return user;
}
