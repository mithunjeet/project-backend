
import { Subscription } from "../models/subscription.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const subscribedChannel = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    console.log("idofSubscriber" + "   " + _id);
    const { channelName } = req.body;
    console.log(channelName);

    if (!_id) {
        throw new apiError(404, "_id not found");
    }
    if (!channelName) {
        throw new apiError(400, "channel name not found ");
    }

    // If subscription does not exist, it means it's the first time the channel is formed
    const channel = await User.findOne({ username : channelName });
    if (!channel) {
        throw new apiError(404, "Channel not found");
    }

    const exist = await Subscription.findOne({ channel: channel._id });

    if (!exist) {
        await Subscription.create({
            channel: channel._id,
            subscriber: [_id],
        });

        return res.status(200).json({
            message: "Subscribed successfully",
            success: true,
        });

    } else {

        // If the channel already exists, check if the user is already a subscriber or not 
        
        if (!exist.subscriber.includes(_id)) {
            exist.subscriber.push(_id);
            await exist.save();

            return res.status(200).json({
                message: "Subscribed successfully",
                success: true,
            });
        } else {
            throw new apiError(400, "User has already subscribed");
        }
    }
});

const getAllCreatedChannle = asyncHandler(async (req, res) => {
    const data = await User.aggregate([
      {
        $group: {
          _id: null,
          combinedDocument: {
            $push: {
              idofuser: "$_id",
            },
          },
        },
      },
    ]);
  
    let wholedocumet = [];
  
    if (data.length > 0 && data[0].combinedDocument) {
      // Use map to create an array of promises
      const promises = data[0].combinedDocument.map(async (eachdocument) => {
        const doc = await User.aggregate([
          {
            $match: {
              _id: eachdocument.idofuser,
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriber",
              as: "channelThatUSerHasSubcribed",
            },
          },
          {
            $addFields: {
              totalSubscriberOfTheUser: {
                $size: "$subscribers",
              },
             TotalChannelThatUserHasSubscribed: {
                $size: "$channelThatUSerHasSubcribed",
              },
            },
          },
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
              coverimage: 1,
              TotalChannelThatUserHasSubscribed: 1,
              totalSubscriberOfTheUser: 1,
              email: 1,
            },
          },
        ]);
        return doc[0]; // Return the first document of the aggregation result
      });
  
      // Wait for all promises to resolve and store the results in wholedocumet
        //   wholedocumet = await Promise.all(promises);
        wholedocumet.push( await Promise.all(promises))
    }
  
    return res.status(200).json({ success: true, message: "get all user", wholedocumet });
  });
  

//   Use map to iterate over combinedDocument and create an array of promises. Each promise represents an asynchronous aggregation operation.
// Waiting for Promises:

// Use Promise.all(promises) to wait for all the promises to resolve. This ensures that all the aggregation operations complete before proceeding.






// very very important
  /* 
 Key Points About Promise.all
Resolving:

The promise returned by Promise.all resolves when all of the input promises have resolved.
The resolved value will be an array of the resolved values from the input promises, in the same order as the input promises.
Rejecting:

If any of the input promises reject, the promise returned by Promise.all immediately rejects with the reason of the first promise that rejects.
This means that even if some promises in the input array succeed, as soon as one promise rejects, the entire Promise.all rejects.
Usage:

Useful for running multiple asynchronous operations concurrently and waiting for all of them to complete before proceeding.
Ensures that you have all the results before continuing with your logic.
Example Usage
Basic Example
javascript
Copy code
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 42, "foo"]
}).catch((error) => {
  console.error(error);
});
In this example:

promise1 resolves to 3 immediately.
promise2 is not a promise but a value, which is treated as a resolved promise.
promise3 resolves to "foo" after 100 milliseconds.
Promise.all waits for all of these to resolve and then logs the array [3, 42, "foo"].
Real-world Example with API Calls
Suppose you have multiple asynchronous API calls, and you want to wait for all of them to complete before proceeding:

javascript
Copy code
async function fetchAllData() {
  const fetchData1 = fetch('/api/data1').then(response => response.json());
  const fetchData2 = fetch('/api/data2').then(response => response.json());
  const fetchData3 = fetch('/api/data3').then(response => response.json());

  try {
    const results = await Promise.all([fetchData1, fetchData2, fetchData3]);
    console.log(results); // [data1, data2, data3]
  } catch (error) {
    console.error('One of the requests failed', error);
  }
}

fetchAllData();
Use Case in Yo
  
  */

export { subscribedChannel ,getAllCreatedChannle};
