import $ from "jquery";
import _ from "lodash";
import keycode from "keycode";

import React from "react";
import {withRouter} from 'react-router';
import {FormattedMessage, FormattedNumber} from 'react-intl';

import AltContainer from "alt-container";


import SearchConstants from "../../utils/SearchConstants";
import LocationHistory from "../../utils/LocationHistory";

import ScreenshotsRepositoryStore from "../../stores/screenshots/ScreenshotsRepositoryStore";
import ScreenshotsLocaleStore from "../../stores/screenshots/ScreenshotsLocaleStore";
import ScreenshotsPageStore from "../../stores/screenshots/ScreenshotsPageStore";
import ScreenshotsSearchTextStore from "../../stores/screenshots/ScreenshotsSearchTextStore";
import ScreenshotsPaginatorStore from "../../stores/screenshots/ScreenshotsPaginatorStore";
import ScreenshotsHistoryStore from "../../stores/screenshots/ScreenshotsHistoryStore";
import ScreenshotStore from "../../stores/screenshots/ScreenshotStore";
import ScreenshotsReviewModalStore from "../../stores/screenshots/ScreenshotsReviewModalStore";
import SearchParamsStore from "../../stores/workbench/SearchParamsStore";

import ScreenshotsPageActions from "../../actions/screenshots/ScreenshotsPageActions";
import ScreenshotsRepositoryActions from "../../actions/screenshots/ScreenshotsRepositoryActions";
import ScreenshotsLocaleActions from "../../actions/screenshots/ScreenshotsLocaleActions";
import ScreenshotsSearchTextActions from "../../actions/screenshots/ScreenshotsSearchTextActions";
import ScreenshotsPaginatorActions from "../../actions/screenshots/ScreenshotsPaginatorActions";
import ScreenshotActions from "../../actions/screenshots/ScreenshotActions";
import ScreenshotsReviewModalActions from "../../actions/screenshots/ScreenshotsReviewModalActions";
import ScreenshotsHistoryActions from "../../actions/screenshots/ScreenshotsHistoryActions";
import WorkbenchActions from "../../actions/workbench/WorkbenchActions";


import RepositoryDropdown from "./RepositoryDropdown";
import LocalesDropdown from "./LocalesDropdown";
import Paginator from "./Paginator";
import ScreenshotsSearchText from "./ScreenshotsSearchText";
import ScreenshotsGrid from "./ScreenshotsGrid";
import StatusDropdown from "./StatusDropdown";
import ScreenshotReviewModal from "./ScreenshotReviewModal";

import {StatusCommonTypes} from "./StatusCommon";


import {Button, Label} from "react-bootstrap";

import FluxyMixin from "alt-mixins/FluxyMixin";

let ScreenshotsPage = React.createClass({

    mixins: [FluxyMixin],

    statics: {
        storeListeners: {
            "onScreenshotsHistoryStoreChange": ScreenshotsHistoryStore
        }
    },

    componentDidMount: function () {
        ScreenshotsRepositoryActions.getAllRepositories();
        this.addWindowKeyUpDownListener();
    },

    componentWillUnmount: function () {
        this.removeWindowKeyDownEventListener();
    },

    /**
     * Don't update the component has it has no rendering based on props or 
     * state. Avoid useless re-rendering when location changes due to updates
     * from onScreenshotsHistoryStoreChange().
     */
    shouldComponentUpdate: function () {
        return false;
    },

    addWindowKeyUpDownListener: function () {
        window.addEventListener('keydown', this.onWindowKeyDown);
    },

    removeWindowKeyDownEventListener: function () {
        window.removeEventListener('keydown', this.onWindowKeyDown);
    },

    /**
     * Handle keyboard event to allow screenshots navigation
     * 
     * @param {SynteticEvent} e
     * @returns {undefined}
     */
    onWindowKeyDown(e) {
        switch (keycode(e)) {
            case "left":
                this.goToPreviousScreenshot();
                break;
            case "right":
                this.goToNextScreenshot();
                break;
        }
    },

    onScreenshotsHistoryStoreChange: function () {
        if (!ScreenshotsHistoryStore.getState().skipLocationHistoryUpdate) {
            LocationHistory.updateLocation(this.props.router, "/screenshots", ScreenshotsHistoryStore.getQueryParams());
        }
    },

    onScreenshotClicked: function (idx) {
        if (ScreenshotsPageStore.getState().selectedScreenshotIdx !== idx) {
            ScreenshotsPageActions.changeSelectedScreenshotIdx(idx);
        }
    },

    onScreenshotsTextUnitNameClick(e, textUnit) {
        e.stopPropagation();

        var selectedRepositoryIds = ScreenshotsRepositoryStore.getState().selectedRepositoryIds;

        WorkbenchActions.searchParamsChanged({
            "changedParam": SearchConstants.UPDATE_ALL,
            "repoIds": selectedRepositoryIds,
            "searchText": textUnit.name,
            "searchAttribute": SearchParamsStore.SEARCH_ATTRIBUTES.STRING_ID,
            "searchType": SearchParamsStore.SEARCH_TYPES.EXACT,
            "bcp47Tags": ScreenshotsRepositoryStore.getAllBcp47TagsForRepositoryIds(selectedRepositoryIds),
        });

        this.props.router.push("/workbench", null, null);
    },

    onScreenshotsTextUnitTargetClick(e, textUnit, locale) {
        
        console.log("locale", locale);
        e.stopPropagation();

        WorkbenchActions.searchParamsChanged({
            "changedParam": SearchConstants.UPDATE_ALL,
            "repoIds": ScreenshotsRepositoryStore.getState().selectedRepositoryIds,
            "searchText": textUnit.name,
            "searchAttribute": SearchParamsStore.SEARCH_ATTRIBUTES.STRING_ID,
            "searchType": SearchParamsStore.SEARCH_TYPES.EXACT,
            "bcp47Tags": [locale],
        });

        this.props.router.push("/workbench", null, null);
    },

    goToPreviousScreenshot() {

        let selectedScreenshotIdx = ScreenshotsPageStore.getState().selectedScreenshotIdx;
        let screenshotsPaginatorStoreState = ScreenshotsPaginatorStore.getState();

        if (selectedScreenshotIdx === 0) {
            if (screenshotsPaginatorStoreState.currentPageNumber > 1) {
                ScreenshotsHistoryActions.disableHistoryUpdate();
                ScreenshotsPaginatorActions.goToPreviousPage();
                ScreenshotsPageActions.changeSelectedScreenshotIdx(screenshotsPaginatorStoreState.limit - 1);
                ScreenshotsHistoryActions.enableHistoryUpdate();
                ScreenshotsPageActions.performSearch();
            }
        } else {
            ScreenshotsPageActions.changeSelectedScreenshotIdx(selectedScreenshotIdx - 1);
        }
    },

    goToNextScreenshot() {
        let screenshotsPaginatorStoreState = ScreenshotsPaginatorStore.getState();
        let screenshotsPageStoreState = ScreenshotsPageStore.getState();
        let selectedScreenshotIdx = ScreenshotsPageStore.getState().selectedScreenshotIdx;

        if (selectedScreenshotIdx === (screenshotsPaginatorStoreState.limit - 1)) {
            ScreenshotsHistoryActions.disableHistoryUpdate();
            ScreenshotsPaginatorActions.goToNextPage();
            ScreenshotsPageActions.changeSelectedScreenshotIdx(0);
            ScreenshotsHistoryActions.enableHistoryUpdate();
            ScreenshotsPageActions.performSearch();
        } else if (selectedScreenshotIdx < screenshotsPageStoreState.screenshotsData.length - 1) {
            ScreenshotsPageActions.changeSelectedScreenshotIdx(selectedScreenshotIdx + 1);
        }
    },

    render: function () {

        return (
                <div>
                    <div>
                        <div className="pull-left">
                            <AltContainer store={ScreenshotsRepositoryStore}>
                                <RepositoryDropdown onSelectedRepositoryIdsChanged={(selectedRepositoryIds) => {
                        ScreenshotsRepositoryActions.changeSelectedRepositoryIds(selectedRepositoryIds);
                        ScreenshotsPageActions.performSearch();
                                                    }} />
                            </AltContainer>
                            <AltContainer store={ScreenshotsLocaleStore}>
                                <LocalesDropdown onSelectedBcp47TagsChanged={(selectedBcp47Tags) => {
                            ScreenshotsLocaleActions.changeSelectedBcp47Tags(selectedBcp47Tags);
                            ScreenshotsPageActions.performSearch();
                                                 }} />
                            </AltContainer>
                        </div>
                
                        <AltContainer store={ScreenshotsSearchTextStore}>
                            <ScreenshotsSearchText
                                onSearchAttributeChanged={ScreenshotsSearchTextActions.changeSearchAttribute}
                                onSearchTypeChanged={ScreenshotsSearchTextActions.changeSearchType }
                                onSearchTextChanged={ScreenshotsSearchTextActions.changeSearchText }
                                onPerformSearch={ScreenshotsPageActions.performSearch}
                                />
                        </AltContainer>
                
                        <AltContainer store={ScreenshotsSearchTextStore}
                                      shouldComponentUpdate={(props, nextProps, nextState) => {
                                //TODO investigate that pattern vs dedicated store
                                return props.status !== nextState.status
                                      }} >
                            <StatusDropdown onStatusChanged={(statusAndIdx) => {
                                    ScreenshotsSearchTextActions.changeStatus(statusAndIdx);
                                    ScreenshotsPageActions.performSearch();
                                            }} />
                        </AltContainer>
                
                        <AltContainer store={ScreenshotsPaginatorStore}>
                            <Paginator 
                                onPreviousPageClicked={() => {
                                        ScreenshotsHistoryActions.disableHistoryUpdate();
                                        ScreenshotsPaginatorActions.goToPreviousPage();
                                        ScreenshotsPageActions.changeSelectedScreenshotIdx(0);
                                        ScreenshotsHistoryActions.enableHistoryUpdate();
                                        ScreenshotsPageActions.performSearch();
                                }}
                                onNextPageClicked={() => {
                                            ScreenshotsHistoryActions.disableHistoryUpdate();
                                            ScreenshotsPaginatorActions.goToNextPage();
                                            ScreenshotsPageActions.changeSelectedScreenshotIdx(0);
                                            ScreenshotsHistoryActions.enableHistoryUpdate();
                                            ScreenshotsPageActions.performSearch();
                                }} />
                        </AltContainer>
                
                    </div>
                
                    <AltContainer store={ScreenshotsPageStore}>
                        <ScreenshotsGrid 
                            onScreenshotsTextUnitTargetClick={this.onScreenshotsTextUnitTargetClick} 
                            onScreenshotsTextUnitNameClick={this.onScreenshotsTextUnitNameClick} 
                            onScreenshotClicked={this.onScreenshotClicked} 
                            onLocaleClick={ (locale) => {
                                                ScreenshotsHistoryActions.disableHistoryUpdate();
                                                ScreenshotsSearchTextActions.changeSearchText(null);
                                                ScreenshotsLocaleActions.changeSelectedBcp47Tags(locale);
                                                ScreenshotsPaginatorActions.changeCurrentPageNumber(1);
                                                ScreenshotsHistoryActions.enableHistoryUpdate();
                                                ScreenshotsPageActions.performSearch();
                            }}
                            onNameClick={ (name) => {
                                                    ScreenshotsHistoryActions.disableHistoryUpdate();
                                                    ScreenshotsSearchTextActions.changeSearchText(name);
                                                    ScreenshotsLocaleActions.changeSelectedBcp47Tags(
                                                            ScreenshotsRepositoryStore.getAllBcp47TagsForRepositoryIds(
                                                                    ScreenshotsRepositoryStore.getState().selectedRepositoryIds));
                                                    ScreenshotsSearchTextActions.changeSearchType(SearchParamsStore.SEARCH_TYPES.EXACT);
                                                    ScreenshotsSearchTextActions.changeSearchAttribute(ScreenshotsSearchTextStore.SEARCH_ATTRIBUTES_SCREENSHOT);
                                                    ScreenshotsPaginatorActions.changeCurrentPageNumber(1);
                                                    ScreenshotsHistoryActions.enableHistoryUpdate();
                                                    ScreenshotsPageActions.performSearch();
                            }}
                            onStatusGlyphClick={(screenshotIdx) => {
                                                        console.log("onStatusGlyphClick", screenshotIdx);
                                                        ScreenshotsReviewModalActions.openWithScreenshot(screenshotIdx);
                            }}
                            onStatusChanged={ScreenshotActions.changeStatus}
                            />
                    </AltContainer>
                
                    <AltContainer store={ScreenshotsReviewModalStore}>
                        <ScreenshotReviewModal
                            onCancel={ScreenshotsReviewModalActions.close}
                            onSave={ScreenshotsReviewModalActions.save}
                            onCommentChanged={ScreenshotsReviewModalActions.changeComment}
                            onStatusChanged={ScreenshotsReviewModalActions.changeStatus}
                            />
                    </AltContainer>
                </div>
                                                    );
    },

});

export default withRouter(ScreenshotsPage);
