import ScreenshotsPageActions from "./ScreenshotsPageActions";

import ScreenshotsRepositoryStore from "../../stores/screenshots/ScreenshotsRepositoryStore";
import ScreenshotsLocaleStore from "../../stores/screenshots/ScreenshotsLocaleStore";
import ScreenshotsSearchTextStore from "../../stores/screenshots/ScreenshotsSearchTextStore";
import ScreenshotsPaginatorStore from "../../stores/screenshots/ScreenshotsPaginatorStore";
import ScreenshotClient from "../../sdk/ScreenshotClient";
import {StatusCommonTypes} from "../../components/screenshots/StatusCommon";

window.screenshotsData = [
    {
        name: "screen 1",
        src: "img/screenshots/1.png",
        locale: "fr-FR",
        status: 'ACCEPTED',
        comment: 'screen 1 comment',
        textUnits: [
            {
                name: "ContactInfo.customSupportEmail",
                source: "Email",
                target: "Email",
            }, {
                name: "more",
                source: "More",
                target: "Plus"
            }, {
                name: "explore_promoted_by",
                source: "Promoted by %1$s",
                target: "Sponsorisée par %1$s"
            }, {
                name: "explore_promoted_info_dialog_title",
                source: "Pinterest paid to have this content show up where you'd be more likely to notice it.",
                target: "Pinterest a payé pour que ce contenu s'affiche à l'endroit où vous êtes plus susceptible de le remarquer."
            }]
    }, {
        name: "screen 2",
        src: "img/screenshots/1.png",
        locale: "de-DE",
        status: 'NEEDS_REVIEW',
        textUnits: [{
                name: "tua",
                source: "sourcea"
            }, {
                name: "tub",
                source: "sourceb"
            }, {
                name: "tuc",
                source: "sourcec"
            }]
    }, {
        name: "screen 3",
        src: "img/screenshots/1.png",
        locale: "fr-FR",
        status: 'ACCEPTED',
        textUnits: [{
                name: "tu1",
                source: "source1"
            }, {
                name: "tu2",
                source: "source1"
            }, {
                name: "tu3",
                source: "source1"
            }]
    }, {
        name: "screen 4",
        src: "img/screenshots/1.png",
        locale: "fr-FR",
        status: 'ACCEPTED',
        textUnits: [{
                name: "tu1",
                source: "source1"
            }, {
                name: "tu2",
                source: "source1"
            }, {
                name: "tu3",
                source: "source1"
            }]
    }, {
        name: "screen 5",
        src: "img/screenshots/1.png",
        locale: "fr-FR",
        status: 'REJECTED',
        textUnits: [{
                name: "tu1",
                source: "source1"
            }, {
                name: "tu2",
                source: "source1"
            }, {
                name: "tu3",
                source: "source1"
            }]
    }];

const ScreenshotsDataSource = {
    performScreenshotSearch: {
        remote(state) {
            console.log("performScreenshotSearch");
            let screenshotsRepositoryStoreState = ScreenshotsRepositoryStore.getState();
            let screenshotsLocaleStoreState = ScreenshotsLocaleStore.getState();
            let screenshotsSearchTextStoreState = ScreenshotsSearchTextStore.getState();
            let screenshotsPaginatorStoreState = ScreenshotsPaginatorStore.getState();

            let promise;

            if (screenshotsRepositoryStoreState.selectedRepositoryIds.length === 0
                    || screenshotsLocaleStoreState.selectedBcp47Tags.length === 0) {
                 console.log("empty");
                promise = new Promise((resolve) => {
                    setTimeout(function () {
                        resolve([]);
                    }, 0);
                });
            } else {
                let params = {
                    repositoryIds: screenshotsRepositoryStoreState.selectedRepositoryIds,
                    bcp47Tags: screenshotsLocaleStoreState.selectedBcp47Tags,
                    screenshotName: screenshotsSearchTextStoreState.searchText,
                    status: screenshotsSearchTextStoreState.status === StatusCommonTypes.ALL ? null : screenshotsSearchTextStoreState.status,
                    limit: screenshotsPaginatorStoreState.limit,
                    offset: screenshotsPaginatorStoreState.limit * (screenshotsPaginatorStoreState.currentPageNumber - 1),
                };

                promise = ScreenshotClient.getScreenshots(params).then(function (results) {
                    return results;
                });
            }

            return promise;
        },
        success: ScreenshotsPageActions.screenshotsSearchResultsReceivedSuccess,
        error: ScreenshotsPageActions.screenshotsSearchResultsReceivedError
    },
};

export default ScreenshotsDataSource;
