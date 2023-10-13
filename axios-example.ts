import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();

const apiGwKey = process.env.API_GW_KEY
const invokeUrl = process.env.API_GW_URL || ""

const handleFormSubmit = async () => {
    const { data } = await axios.post(invokeUrl, {
        "sourceAndPath": "MyAppName_BugReport",
        "requestDate": new Date().toISOString(),
        "userName": "my name",
        "userEmail": "peter@gmail.com",
        "subject": "bug report",
        "message": "submit button not working"

    }, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiGwKey
        }
    }
    )
    console.log({ data });
}

handleFormSubmit();