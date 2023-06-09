const gameInput = { gameName: 'HeroPipe', publisherName: 'Gamee' };
//loading scripts
$.getScript(


    "https://g.glance-cdn.com/public/content/games/xiaomi/gamesAd.js",

    "gpid.js"

)
    .done(function (script, textStatus) {
        console.log(textStatus);
        window.GlanceGamingAdInterface.setupLibrary(gameInput, successCb, failCb);
    })
    .fail(function (jqxhr, settings, exception) {
        console.log("MLIB load failed, reason : ", exception);
    });


var LPBannerInstance, LBBannerInstance, StickyBannerInstance, replayInstance, GlanceGamingAdInstance, rewardInstance, _triggerReason;
var is_replay_noFill = false
var is_rewarded_noFill = false
var isRewardGranted = false
var isRewardedAdClosedByUser = false
// Objects for different ad format.
const LPMercObj = {
    adUnitName: "Gamee_HeroPipe_Gameload_Bottom",
    pageName: 'Gamee_HeroPipe',               //Game Name
    categoryName: 'Gamee',           //Publisher Name
    placementName: 'gameload',
    containerID: "div-gpt-ad-2",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}
const StickyObj = {
    adUnitName: "Gamee_HeroPipe_Ingame_Bottom",
    pageName: 'Gamee_HeroPipe',               //Game Name
    categoryName: 'Gamee',           //Publisher Name
    placementName: 'ingame',
    containerID: "banner-ad",            //Div Id for banner
    height: 50,
    width: 320,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}

const LBBannerObj = {
    adUnitName: "Gamee_HeroPipe_Leaderboard_Top",
    pageName: 'Gamee_HeroPipe',               //Game Name
    categoryName: 'Gamee',           //Publisher Name
    placementName: 'leaderboard',
    containerID: "div-gpt-ad-1",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}

function successCb() {
    console.log("set up lib success")
    showBumperAd();

}
function failCb(reason) { }



const replayObj = {
    adUnitName: "Gamee_HeroPipe_FsReplay_Replay",
    placementName: "FsReplay",
    pageName: 'Gamee_HeroPipe',
    categoryName: 'Gamee',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    gpid: gpID,
}
const rewardObj = {
    adUnitName: "Gamee_HeroPipe_FsRewarded_Reward",
    placementName: "FsRewarded",
    pageName: 'Gamee_HeroPipe',
    categoryName: 'Gamee',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    gpid: gpID,
}

//banner ads callbacks 
function bannerCallbacks(obj) {


    obj.adInstance?.registerCallback('onAdLoadSucceed', (data) => {
        console.log('onAdLoadSucceeded CALLBACK', data);

        if (obj.adUnitName === LBBannerObj.adUnitName) {
            $("#div-gpt-ad-1").css("display", "flex")
            $(".gameOverDiv").css("margin-top", "0px");
        }
    });

    obj.adInstance?.registerCallback('onAdLoadFailed', (data) => {
        console.log('onAdLoadFailed  CALLBACK', data);


        if (obj.adUnitName === LBBannerObj.adUnitName) {
            $("#div-gpt-ad-1").css("display", "none")
            $(".gameOverDiv").css("margin-top", "100px");

        }
    });

    obj.adInstance?.registerCallback('onAdDisplayed', (data) => {
        console.log('onAdDisplayed  CALLBACK', data);
    });


}
// rewarded ad callbacks
function rewardedCallbacks(obj) {



    obj.adInstance?.registerCallback('onAdLoadSucceed', (data) => {
        console.log('onAdLoadSucceeded Rewarded CALLBACK', data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_noFill = false
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_noFill = false
        }


    });

    obj.adInstance?.registerCallback('onAdLoadFailed', (data) => {
        console.log('onAdLoadFailed Rewarded CALLBACK', data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_noFill = true
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_noFill = true
        }


    });

    obj.adInstance?.registerCallback('onAdDisplayed', (data) => {
        console.log('onAdDisplayed Rewarded CALLBACK', data);


    });



    obj.adInstance?.registerCallback('onAdClosed', (data) => {
        console.log('onAdClosed Rewarded CALLBACK', data);

        if (obj.adUnitName == rewardObj.adUnitName) {
            isRewardedAdClosedByUser = true
        }
        runOnAdClosed();
        isRewardGranted = false
        isRewardedAdClosedByUser = false



    });

    obj.adInstance?.registerCallback('onAdClicked', (data) => {
        console.log('onAdClicked Rewarded CALLBACK', data);
    });

    obj.adInstance?.registerCallback('onRewardsUnlocked', (data) => {
        console.log('onRewardsUnlocked Rewarded CALLBACK', data);

        if (obj.adUnitName === rewardObj.adUnitName) {
            isRewardGranted = true
        }

    });

}
// function to be called after ad closes
function runOnAdClosed() {
    if (_triggerReason === 'replay') {

        replayDone();
        _triggerReason = ''
        showGame();

        replayInstance = window.GlanceGamingAdInterface.loadRewardedAd(replayObj, rewardedCallbacks);

    } else if (_triggerReason === 'reward') {

        // If user close ad before reward
        if (!isRewardGranted && isRewardedAdClosedByUser) {
            // call game function for not earning reward (failure case)
            rewardFail();
        } else {
            rewardDone();
            // call game function for earned reward  (success case)
        }
        _triggerReason = ''
        rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);

    }


}

// function called on replay button (leaderboard) clicked
function replayEvent() {
    _triggerReason = 'replay'
    if (!is_replay_noFill) {
        window.GlanceGamingAdInterface.showRewarededAd(replayInstance);
    } else {
        runOnAdClosed();
    }

}

function rewardEvent() {
    _triggerReason = 'reward'
    if (!is_rewarded_noFill) {
        window.GlanceGamingAdInterface.showRewarededAd(rewardInstance);
    } else {
        runOnAdClosed();
    }

}



function showGame() {
    if (recUI === 'true') {
        window.PwaGameCenterInterface.hideRecommendedSection();
        showcanvas();
    }

    else {
        $('#playMore').css("display", "none");
        LBBannerInstance.destroyAd();
        $("#div-gpt-ad-1").html("");
    }
}

