import { tweetsData as intialTweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let tweetsData = intialTweetsData;

document.addEventListener("input", function (e) {
  if (e.target.dataset.postInput) {
    handlePostInput(e.target.dataset.postInput);
  }
});

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.post) {
    handlePostClick(e.target.dataset.post);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  updateTweetsDataLocalStorage();
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  updateTweetsDataLocalStorage();
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    updateTweetsDataLocalStorage();
    render();
    tweetInput.value = "";
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = `
            <div class="post-container">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea placeholder="Add a reply" class="post-input" id="post-input-${tweet.uuid}" data-post-input="${tweet.uuid}"></textarea>
                <button class="btn-disabled post-btn" id="post-btn-${tweet.uuid}" data-post="${tweet.uuid}" disabled>Post</button>
            </div>   
        `;

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`;
  });
  return feedHtml;
}

function handlePostClick(tweetId) {
  const replyInput = document.getElementById(`post-input-${tweetId}`);
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  targetTweetObj.replies.push({
    handle: `@Scrimba`,
    profilePic: `images/scrimbalogo.png`,
    tweetText: replyInput.value,
  });
  updateTweetsDataLocalStorage();
  render();
  document.getElementById(`replies-${tweetId}`).classList.remove("hidden");
  replyInput.value = "";
}

function handlePostInput(tweetId) {
  const postInput = document.getElementById(`post-input-${tweetId}`);
  const postBtn = document.getElementById(`post-btn-${tweetId}`);
  if (postInput.value) {
    postBtn.disabled = false;
    postBtn.classList.remove("btn-disabled");
  } else {
    postBtn.disabled = true;
    postBtn.classList.add("btn-disabled");
  }
}

function updateTweetsDataLocalStorage() {
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
}

function getTweetsData() {
  if (localStorage.getItem("tweetsData")) {
    tweetsData = JSON.parse(localStorage.getItem("tweetsData"));
  }
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

getTweetsData();
render();
